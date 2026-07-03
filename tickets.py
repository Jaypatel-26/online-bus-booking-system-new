"""
PDF Ticket generator using ReportLab.
GET /api/ticket/{pnr}/pdf  →  returns a PDF file
"""
import io
from datetime import datetime
# pyrefly: ignore [missing-import]
from fastapi import APIRouter, HTTPException
# pyrefly: ignore [missing-import]
from fastapi.responses import StreamingResponse
from backend import database as db

router = APIRouter(prefix="/api/ticket", tags=["tickets"])


def _parse_amount(raw: str) -> str:
    """Strip 'Rs.' and return clean amount string."""
    return raw.replace("Rs.", "").strip()

@router.get("/my-tickets")
def get_my_tickets(mobile: str, email: str):
    """Fetch all tickets (past and future) for a user."""
    if not mobile or not email:
        raise HTTPException(status_code=400, detail="Mobile and email are required.")
    
    bookings = db.get_bookings_by_user(mobile, email)
    return bookings


@router.get("/{pnr}/pdf")
def download_ticket_pdf(pnr: str):
    """Generate and stream a professional PDF ticket."""
    try:
        from reportlab.lib.pagesizes import A4
        from reportlab.lib import colors
        from reportlab.lib.units import mm
        from reportlab.platypus import (
            SimpleDocTemplate, Table, TableStyle, Paragraph,
            Spacer, HRFlowable
        )
        from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
        from reportlab.lib.enums import TA_CENTER, TA_LEFT, TA_RIGHT
        from reportlab.graphics.shapes import Drawing, Rect, String
        from reportlab.graphics.barcode import code128
    except ImportError:
        raise HTTPException(
            status_code=500,
            detail="reportlab library not installed. Run: pip install reportlab"
        )

    booking = db.get_booking_by_pnr(pnr)
    if not booking:
        raise HTTPException(status_code=404, detail="Booking not found")

    buf = io.BytesIO()

    # ── Colour palette ─────────────────────────────────────────────────────────
    BRAND_RED   = colors.HexColor("#bf1f2f")
    BRAND_DARK  = colors.HexColor("#1e293b")
    BRAND_LIGHT = colors.HexColor("#f8fafc")
    ACCENT      = colors.HexColor("#0f766e")
    MUTED       = colors.HexColor("#64748b")
    WHITE       = colors.white

    doc = SimpleDocTemplate(
        buf,
        pagesize=A4,
        rightMargin=15 * mm,
        leftMargin=15 * mm,
        topMargin=15 * mm,
        bottomMargin=15 * mm,
    )

    styles = getSampleStyleSheet()
    story  = []

    # ── Header ─────────────────────────────────────────────────────────────────
    header_style = ParagraphStyle(
        "header", fontSize=22, leading=28, textColor=WHITE,
        fontName="Helvetica-Bold", alignment=TA_CENTER
    )
    sub_style = ParagraphStyle(
        "sub", fontSize=10, leading=12, textColor=colors.HexColor("#cbd5e1"),
        fontName="Helvetica", alignment=TA_CENTER
    )

    header_data = [
        [Paragraph("Gujarat Bus Seva", header_style)],
        [Paragraph("Confirmed E-Ticket  •  GSRTC Inspired Demo", sub_style)]
    ]
    header_table = Table(header_data, colWidths=[180 * mm])
    header_table.setStyle(TableStyle([
        ("BACKGROUND",    (0, 0), (-1, 0), BRAND_RED),
        ("BACKGROUND",    (0, 1), (-1, 1), BRAND_DARK),
        ("TOPPADDING",    (0, 0), (-1, 0), 16),
        ("BOTTOMPADDING", (0, 0), (-1, 0), 16),
        ("TOPPADDING",    (0, 1), (-1, 1), 8),
        ("BOTTOMPADDING", (0, 1), (-1, 1), 8),
    ]))
    story.append(header_table)
    story.append(Spacer(1, 6 * mm))

    # ── PNR Banner ─────────────────────────────────────────────────────────────
    pnr_style = ParagraphStyle(
        "pnr", fontSize=28, leading=34, fontName="Helvetica-Bold",
        textColor=BRAND_RED, alignment=TA_CENTER
    )
    pnr_label = ParagraphStyle(
        "pnrl", fontSize=9, leading=11, fontName="Helvetica",
        textColor=MUTED, alignment=TA_CENTER
    )
    pnr_data = [
        [Paragraph("PNR NUMBER", pnr_label)],
        [Paragraph(booking["pnr"], pnr_style)]
    ]
    pnr_table = Table(pnr_data, colWidths=[180 * mm])
    pnr_table.setStyle(TableStyle([
        ("BACKGROUND",    (0, 0), (-1, -1), BRAND_LIGHT),
        ("TOPPADDING",    (0, 0), (-1, 0), 12),
        ("BOTTOMPADDING", (0, 1), (-1, 1), 12),
        ("BOX",           (0, 0), (-1, -1), 1.5, BRAND_RED),
    ]))
    story.append(pnr_table)
    story.append(Spacer(1, 5 * mm))

    # ── Route Banner ───────────────────────────────────────────────────────────
    city_style = ParagraphStyle(
        "city", fontSize=18, fontName="Helvetica-Bold",
        textColor=BRAND_DARK, alignment=TA_CENTER
    )
    arrow_style = ParagraphStyle(
        "arrow", fontSize=22, fontName="Helvetica-Bold",
        textColor=BRAND_RED, alignment=TA_CENTER
    )
    route_data = [[
        Paragraph(booking["source"], city_style),
        Paragraph("→", arrow_style),
        Paragraph(booking["destination"], city_style),
    ]]
    route_table = Table(route_data, colWidths=[72 * mm, 36 * mm, 72 * mm])
    route_table.setStyle(TableStyle([
        ("BACKGROUND",    (0, 0), (-1, -1), colors.HexColor("#eff6ff")),
        ("TOPPADDING",    (0, 0), (-1, -1), 12),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 12),
        ("VALIGN",        (0, 0), (-1, -1), "MIDDLE"),
        ("BOX",           (0, 0), (-1, -1), 1, colors.HexColor("#bfdbfe")),
    ]))
    story.append(route_table)
    story.append(Spacer(1, 5 * mm))

    # ── Details Grid ──────────────────────────────────────────────────────────
    label_style = ParagraphStyle(
        "lbl", fontSize=8, fontName="Helvetica",
        textColor=MUTED, alignment=TA_LEFT
    )
    value_style = ParagraphStyle(
        "val", fontSize=10, fontName="Helvetica-Bold",
        textColor=BRAND_DARK, alignment=TA_LEFT
    )

    def lv(label, value):
        return [Paragraph(label, label_style), Paragraph(str(value), value_style)]

    details = [
        lv("PASSENGER NAME",  booking["passenger_name"]),
        lv("MOBILE",          booking["mobile"]),
        lv("EMAIL",           booking["email"]),
        lv("BUS NAME",        booking["bus_name"]),
        lv("JOURNEY DATE",    booking["journey_date"]),
        lv("SEATS",           booking["seats"]),
        lv("BOARDING POINT",  booking["boarding_point"]),
    ]

    # Group into 2 columns with adjusted widths so email doesn't wrap awkwardly
    grid_rows = []
    for i in range(0, len(details), 2):
        left  = details[i]
        right = details[i + 1] if i + 1 < len(details) else [Paragraph("", label_style), Paragraph("", value_style)]
        grid_rows.append([left[0], left[1], right[0], right[1]])

    grid_table = Table(
        grid_rows,
        colWidths=[35 * mm, 55 * mm, 35 * mm, 55 * mm]
    )
    grid_table.setStyle(TableStyle([
        ("BACKGROUND",    (0, 0), (-1, -1), WHITE),
        ("TOPPADDING",    (0, 0), (-1, -1), 10),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 10),
        ("LEFTPADDING",   (0, 0), (-1, -1), 8),
        ("RIGHTPADDING",  (0, 0), (-1, -1), 8),
        ("VALIGN",        (0, 0), (-1, -1), "MIDDLE"),
        ("BOX",           (0, 0), (-1, -1), 1, colors.HexColor("#e2e8f0")),
        ("LINEBELOW",     (0, 0), (-1, -2), 0.5, colors.HexColor("#f1f5f9")),
        ("LINEBEFORE",    (2, 0), (2, -1), 0.5, colors.HexColor("#f1f5f9")),
    ]))
    story.append(grid_table)
    story.append(Spacer(1, 5 * mm))


    # ── Fare Summary ──────────────────────────────────────────────────────────
    fare_label = ParagraphStyle(
        "fl", fontSize=9, fontName="Helvetica", textColor=BRAND_DARK, alignment=TA_LEFT
    )
    fare_value = ParagraphStyle(
        "fv", fontSize=9, fontName="Helvetica", textColor=BRAND_DARK, alignment=TA_RIGHT
    )
    total_label = ParagraphStyle(
        "tl", fontSize=11, fontName="Helvetica-Bold", textColor=WHITE, alignment=TA_LEFT
    )
    total_value = ParagraphStyle(
        "tv", fontSize=11, fontName="Helvetica-Bold", textColor=WHITE, alignment=TA_RIGHT
    )

    fare_rows = [
        [Paragraph("Base Fare",   fare_label), Paragraph(booking["base_fare"],    fare_value)],
        [Paragraph("Concession",  fare_label), Paragraph(f"- {booking['concession']}", fare_value)],
        [Paragraph("Service Fee", fare_label), Paragraph(booking["service_fee"],  fare_value)],
        [Paragraph("TOTAL AMOUNT", total_label), Paragraph(booking["amount"],     total_value)],
    ]
    fare_table = Table(fare_rows, colWidths=[140 * mm, 40 * mm])
    fare_table.setStyle(TableStyle([
        ("BACKGROUND",    (0, 0), (-1, 2), BRAND_LIGHT),
        ("BACKGROUND",    (0, 3), (-1, 3), ACCENT),
        ("TOPPADDING",    (0, 0), (-1, -1), 8),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 8),
        ("LEFTPADDING",   (0, 0), (-1, -1), 10),
        ("RIGHTPADDING",  (0, 0), (-1, -1), 10),
        ("LINEABOVE",     (0, 3), (-1, 3), 1.5, ACCENT),
        ("BOX",           (0, 0), (-1, -1), 1, colors.HexColor("#e2e8f0")),
    ]))
    story.append(fare_table)
    story.append(Spacer(1, 5 * mm))

    # ── Barcode ───────────────────────────────────────────────────────────────
    try:
        barcode = code128.Code128(
            booking["pnr"],
            barWidth=0.8, barHeight=20 * mm,
            humanReadable=True,
        )
        bc_width  = barcode.width
        bc_height = barcode.height + 6 * mm

        drawing = Drawing(180 * mm, bc_height)
        # pyrefly: ignore [unexpected-keyword]
        drawing.add(barcode, x=(180 * mm - bc_width) / 2, y=4 * mm)
        story.append(drawing)
        story.append(Spacer(1, 3 * mm))
    except Exception:
        pass  # Skip barcode if error

    # ── Footer ─────────────────────────────────────────────────────────────────
    story.append(HRFlowable(width="100%", thickness=1, color=colors.HexColor("#e2e8f0")))
    footer_style = ParagraphStyle(
        "foot", fontSize=8, fontName="Helvetica",
        textColor=MUTED, alignment=TA_CENTER, spaceBefore=4
    )
    generated = datetime.now().strftime("%d-%m-%Y %H:%M")
    story.append(Paragraph(
        f"Generated: {generated}  •  Gujarat Bus Seva  •  GSRTC Inspired Demo  •  This is not a real ticket.",
        footer_style
    ))

    doc.build(story)
    buf.seek(0)

    return StreamingResponse(
        buf,
        media_type="application/pdf",
        headers={
            "Content-Disposition": f'attachment; filename="ticket_{pnr}.pdf"',
        },
    )
