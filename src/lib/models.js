import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
    {
        username: {
            type: String,
            required: true,
            unique: true,
            min: 3,
            max: 20,
        },
        email: {
            type: String,
            required: true,
            unique: true,
            max: 50,
        },
        password: {
            type: String,
        },
        img: {
            type: String,
        },
        isAdmin: {
            type: Boolean,
            default: false,
        },
    },
    { timestamps: true }
);

const assetsSchema = new mongoose.Schema({
    ID: {
        type: Number,
        unique: true,
        required: true
    },
    Category: {
        type: String,
        required: true
    },
    Name: {
        type: String,
        required: true
    },
    Ticker: {
        type: String,
        required: true
    },
    Potential: {
        type: Number
    },
    Sicherheit: {
        type: Number
    },
    MarketCap: {
        type: Number
    },
    Bottom: {
        type: Number
    },
    TrueBottom: {
        type: Number,
        default: null
    },
    BottomDate: {
        type: Date
    },
    Top: {
        type: Number
    },
    TopDate: {
        type: Date
    },
    BottomRanking: {
        type: Number
    },
    Price: {
        type: Number
    },
    LastPriceUpdate: {
        type: Date
    },
    CoinGeckoID: {
        type: String
    },
    cgPrice: {
        type: Number
    },
    cgImageURL: {
        type: String
    },
    TrendPercentage: {
        type: Number
    },
    reflinkBitvavo: {
        type: String,
        default: ""
    },
    reflinkBitpanda: {
        type: String,
        default: ""
    },
    reflinkMexc: {
        type: String,
        default: ""
    },
    reflinkKucoin: {
        type: String,
        default: ""
    }
}, { timestamps: true });


const portfolioSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    assets: [{
        Category: String,
        Name: String,
        Ticker: String,
        Potential: Number,
        Sicherheit: Number,
        MarketCap: Number,
        Bottom: Number,
        TrueBottom: Number,
        BottomDate: Date,
        Top: Number,
        TopDate: Date,
        BottomRanking: Number,
        Price: { type: Number, required: true },
        LastPriceUpdate: Date,
        CoinGeckoID: String,
        cgPrice: Number,
        cgImageURL: String,
        TrendPercentage: Number,
        reflinkBitvavo: { type: String, default: "" },
        reflinkBitpanda: { type: String, default: "" },
        reflinkMexc: { type: String, default: "" },
        reflinkKucoin: { type: String, default: "" }
    }]
}, { timestamps: true });



export const Portfolio = mongoose.models?.Portfolio || mongoose.model('Portfolio', portfolioSchema);
export const Assets = mongoose.models?.Assets || mongoose.model("Assets", assetsSchema);
export const User = mongoose.models?.User || mongoose.model("User", userSchema);