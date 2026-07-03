"""
Payment routes — Razorpay order creation + verification.
"""
import hashlib
import hmac
import os
from fastapi import APIRouter, HTTPException
from backend.models import CreateOrderRequest, VerifyPaymentRequest
import httpx
import base64

router = APIRouter(prefix="/api", tags=["payments"])

# Razorpay credentials (server-side only — never expose secret to browser)
RAZORPAY_KEY_ID     = "rzp_test_T3voI94KAGZsWY"
RAZORPAY_KEY_SECRET = "655r42fYAcH3WujBudaXL624"


def _razorpay_auth() -> str:
    creds = f"{RAZORPAY_KEY_ID}:{RAZORPAY_KEY_SECRET}"
    return base64.b64encode(creds.encode()).decode()


@router.post("/create-order")
async def create_order(payload: CreateOrderRequest):
    """Create a Razorpay order. Returns order_id used in checkout."""
    body = {
        "amount": payload.amount,
        "currency": "INR",
        "receipt": payload.receipt,
    }
    headers = {
        "Authorization": f"Basic {_razorpay_auth()}",
        "Content-Type": "application/json",
    }
    async with httpx.AsyncClient() as client:
        resp = await client.post(
            "https://api.razorpay.com/v1/orders",
            json=body,
            headers=headers,
            timeout=15,
        )
    if resp.status_code != 200:
        raise HTTPException(
            status_code=resp.status_code,
            detail=resp.json().get("error", {}).get("description", "Razorpay error"),
        )
    return resp.json()


@router.post("/verify-payment")
def verify_payment(payload: VerifyPaymentRequest):
    """Verify Razorpay payment signature (HMAC-SHA256)."""
    message = f"{payload.razorpay_order_id}|{payload.razorpay_payment_id}"
    expected = hmac.new(
        RAZORPAY_KEY_SECRET.encode(),
        message.encode(),
        hashlib.sha256,
    ).hexdigest()

    if expected != payload.razorpay_signature:
        raise HTTPException(status_code=400, detail="Invalid payment signature")

    return {"verified": True}
