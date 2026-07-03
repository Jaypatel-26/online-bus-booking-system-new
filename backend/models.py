"""
Pydantic models for request/response validation.
"""
from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import date, datetime


class BookingCreate(BaseModel):
    pnr: str
    passenger_name: str
    mobile: str
    email: str
    bus_id: str
    bus_name: str
    journey_date: str
    source: str
    destination: str
    boarding_point: str
    seats: str
    base_fare: str
    concession: str
    service_fee: str
    amount: str


class BookingResponse(BaseModel):
    id: str
    pnr: str
    passenger_name: str
    mobile: str
    email: str
    bus_id: str
    bus_name: str
    journey_date: str
    source: str
    destination: str
    boarding_point: str
    seats: str
    base_fare: str
    concession: str
    service_fee: str
    amount: str
    created_at: str


class CreateOrderRequest(BaseModel):
    amount: int   # in paise
    receipt: str


class VerifyPaymentRequest(BaseModel):
    razorpay_order_id: str
    razorpay_payment_id: str
    razorpay_signature: str


class SeatsResponse(BaseModel):
    booked_seats: list[str]
