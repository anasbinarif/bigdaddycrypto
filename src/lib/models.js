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
        CoinGeckoID: {
            type: String,
            required: true
        }
    }]
}, { timestamps: true });

const pastUserSchema = new mongoose.Schema({
    EditPIN: {
        type: String,
        maxlength: 255,
        required: true
    },
    Name: {
        type: String,
        maxlength: 255,
        unique: true,
        required: true
    },
    Email: {
        type: String,
        maxlength: 255
    },
    PremiumUntil: {
        type: Date,
        set: value => {
            try {
                const date = new Date(value);
                return isNaN(date.getTime()) ? "" : date;
            } catch {
                return "";
            }
        }
    },
    Created: {
        type: Date,
        default: Date.now
    },
    LastUpdate: {
        type: Date,
        set: value => {
            try {
                const date = new Date(value);
                return isNaN(date.getTime()) ? "" : date;
            } catch {
                return "";
            }
        }
    },
    UserComment: {
        type: String,
        maxlength: 65535 // Approximate character limit for a TEXT field in SQL
    },
    MissingCoins: {
        type: String,
        maxlength: 65535 // Using the TEXT type approximation
    },
    Expectation: {
        type: String,
        maxlength: 255
    },
    CommentRequested: {
        type: Number
    },
    RequestDate: {
        type: String
    }
}, { timestamps: true });

const pastPortfolioSchema = new mongoose.Schema({
    PortfolioID: {
        type: String,
        required: true
    },
    AssetID: {
        type: Number,
        required: true
    },
    Holdings: {
        type: Number,
        default: 0.0
    },
    avgPrice: {
        type: Number,
        default: 0.0
    },
    totalInvest: {
        type: Number,
        default: 0.0
    },
    totalSold: {
        type: Number,
        default: 0.0
    },
    Relevanz: {
        type: String,
        default: ""
    },
    RelevanzComment: {
        type: String,
        default: ""
    },
    DCA: {
        type: String,
        default: ""
    },
    DCAComment: {
        type: String,
        default: ""
    },
    Gewichtung: {
        type: String,
        default: ""
    },
    GewichtungComment: {
        type: String,
        default: ""
    }
}, { timestamps: true });

export const PastPortfolio = mongoose.models?.PastPortfolio || mongoose.model("PastPortfolio", pastPortfolioSchema);
export const PastUsers = mongoose.models?.PastUsers || mongoose.model("PastUsers", pastUserSchema);
export const UserPortfolio = mongoose.models?.UserPortfolio || mongoose.model('UserPortfolio', portfolioSchema);
export const Assets = mongoose.models?.Assets || mongoose.model("Assets", assetsSchema);
export const User = mongoose.models?.User || mongoose.model("User", userSchema);