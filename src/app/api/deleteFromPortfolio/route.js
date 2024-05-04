import { Portfolio, User } from "@/lib/models";
import mongoose from "mongoose";
import { NextResponse } from "next/server";

export async function POST(req, res) {
    const {portfolioId} = await req.json();

    try {
        const portfolio = await Portfolio.findByIdAndDelete(portfolioId)
    } catch (error) {
        
    }
}