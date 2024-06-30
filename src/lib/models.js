import mongoose from "mongoose";
import { type } from "os";

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
    pastUser: {
      type: String,
      default: "",
    },
    pastUserCheck: {
      type: Boolean,
      default: false,
    },
    pastUserAccessTime: {
      type: Date,
      default: new Date(),
    },
    pastUserAccess: {
      type: Boolean,
      default: false,
    },
    subscribed: {
      type: Boolean,
      default: false,
    },
    currentSubscription: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Payments",
      default: null,
    },
    activated: {
      type: Boolean,
      default: false,
    },
    CookiesPrompt: {
      type: Boolean,
      default: false,
    }
  },
  { timestamps: true }
);

const PaymentsSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    Subscription: {
      plan: {
        type: String,
        enum: ["Pro", "Premium"],
        required: false,
      },
      planId: {
        type: String,
        required: false,
      },
      billingCycle: {
        type: String,
        enum: ["monthly", "yearly"],
        required: false,
      },
      status: {
        type: String,
        enum: ["active", "pastDue"],
        required: false,
      },
      subscriptionId: {
        type: String,
        required: false,
      },
      nextBilledAt: {
        type: Number,
      },
      endDate: {
        type: Number || null,
      },
    },
    oneTimePayment: [
      {
        date: {
          type: Date,
          required: true,
        },
        price: {
          type: Number,
          required: true,
        },
        status: {
          type: String,
          enum: ["Pending", "Paid"],
        },
      },
    ],
  },
  { timestamps: true }
);

const assetsSchema = new mongoose.Schema(
  {
    ID: {
      type: Number,
      unique: true,
      required: true,
    },
    Category: {
      type: [String],
      required: true,
    },
    Risk: {
      type: String,
      default: "",
    },
    Name: {
      type: String,
      required: true,
    },
    Ticker: {
      type: String,
      required: true,
    },
    Potential: {
      type: Number,
    },
    Sicherheit: {
      type: Number,
    },
    MarketCap: {
      type: Number,
    },
    Bottom: {
      type: Number,
    },
    TrueBottom: {
      type: Number,
      default: null,
    },
    BottomDate: {
      type: Date,
    },
    Top: {
      type: Number,
    },
    TopDate: {
      type: Date,
    },
    BottomRanking: {
      type: Number,
    },
    Price: {
      type: Number,
    },
    LastPriceUpdate: {
      type: Date,
    },
    CoinGeckoID: {
      type: String,
    },
    cgPrice: {
      type: Number,
    },
    cgImageURL: {
      type: String,
    },
    TrendPercentage: {
      type: Number,
    },
    reflinkBitvavo: {
      type: String,
      default: "",
    },
    reflinkBitpanda: {
      type: String,
      default: "",
    },
    reflinkMexc: {
      type: String,
      default: "",
    },
    reflinkKucoin: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

const portfolioSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    Notizen: {
      UserComment: {
        type: String,
        default: "",
      },
      MissingCoins: {
        type: String,
        default: "",
      },
    },
    assets: [
      {
        CoinGeckoID: {
          type: String,
          required: true,
        },
        Holdings: {
          type: Number,
          default: 0.0,
        },
        DCA: {
          type: Number,
          default: 0.0,
        },
        DCA_0: {
          type: Number,
          default: 0,
        },
        Gewichtung: {
          type: Number,
          default: 0.0,
        },
        Relevanz: {
          type: Number,
          default: 0.0,
        },
        totalInvest: {
          type: Number,
          default: 0.0,
        },
        totalSold: {
          type: Number,
          default: 0.0,
        },
        totalCoins: {
          type: Number,
          default: 0.0,
        },
        Favourite: {
          type: Boolean,
          default: false,
        },
        buyAndSell: [
          {
            Type: {
              type: String,
              required: true,
            },
            Date: {
              type: Date,
              required: true,
            },
            PricePerCoin: {
              type: Number,
              required: true,
            },
            Betrag: {
              type: Number,
              required: true,
            },
            Coins: {
              type: Number,
              required: true,
            },
          },
        ],
      },
    ],
    Favourite: [
      {
        CoinGeckoID: {
          type: String,
          required: true,
        },
      },
    ],
  },
  { timestamps: true }
);

const pastUserSchema = new mongoose.Schema(
  {
    EditPIN: {
      type: String,
      maxlength: 255,
      required: true,
    },
    Name: {
      type: String,
      maxlength: 255,
      unique: true,
      required: true,
    },
    Email: {
      type: String,
      maxlength: 255,
    },
    PremiumUntil: {
      type: Date,
      set: (value) => {
        try {
          const date = new Date(value);
          return isNaN(date.getTime()) ? "" : date;
        } catch {
          return "";
        }
      },
    },
    Created: {
      type: Date,
      default: Date.now,
    },
    LastUpdate: {
      type: Date,
      set: (value) => {
        try {
          const date = new Date(value);
          return isNaN(date.getTime()) ? "" : date;
        } catch {
          return "";
        }
      },
    },
    UserComment: {
      type: String,
      maxlength: 65535,
    },
    MissingCoins: {
      type: String,
      maxlength: 65535,
    },
    Expectation: {
      type: String,
      maxlength: 255,
    },
    CommentRequested: {
      type: Number,
    },
    RequestDate: {
      type: String,
    },
    ImportedSuccessfully: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const pastPortfolioSchema = new mongoose.Schema(
  {
    ID: {
      type: Number,
      required: true,
    },
    PortfolioID: {
      type: String,
      required: true,
    },
    AssetID: {
      type: Number,
      required: true,
    },
    Holdings: {
      type: Number,
      default: 0.0,
    },
    avgPrice: {
      type: Number,
      default: 0.0,
    },
    totalInvest: {
      type: Number,
      default: 0.0,
    },
    totalSold: {
      type: Number,
      default: 0.0,
    },
    Relevanz: {
      type: String,
      default: "",
    },
    RelevanzComment: {
      type: String,
      default: "",
    },
    DCA: {
      type: String,
      default: "",
    },
    DCAComment: {
      type: String,
      default: "",
    },
    Gewichtung: {
      type: String,
      default: "",
    },
    GewichtungComment: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

const pastBuyAndSellSchema = new mongoose.Schema({
  ID: {
    type: Number,
    required: true,
    unique: true,
  },
  PortfolioAssetID: {
    type: Number,
    required: true,
  },
  Type: {
    type: String,
    required: true,
  },
  Date: {
    type: Date,
    required: true,
  },
  PricePerCoin: {
    type: Number,
    required: true,
  },
  Betrag: {
    type: Number,
    required: true,
  },
  Coins: {
    type: Number,
    required: true,
  },
});

export const Payments =
  mongoose.models?.Payments || mongoose.model("Payments", PaymentsSchema);
export const PastPortfolio =
  mongoose.models?.PastPortfolio ||
  mongoose.model("PastPortfolio", pastPortfolioSchema);
export const PastUsers =
  mongoose.models?.PastUsers || mongoose.model("PastUsers", pastUserSchema);
export const PastBuyAndSell =
  mongoose.models?.PastBuyAndSell ||
  mongoose.model("PastBuyAndSell", pastBuyAndSellSchema);
export const UserPortfolio =
  mongoose.models?.UserPortfolio ||
  mongoose.model("UserPortfolio", portfolioSchema);
export const Assets =
  mongoose.models?.Assets || mongoose.model("Assets", assetsSchema);
export const User = mongoose.models?.User || mongoose.model("User", userSchema);
