const Sequelize = require('sequelize')
const BaseModel = require('./BaseModel')

module.exports = (sequelize) => {
  const User = class extends BaseModel {}

  User.init(
    {
      guid: {
        type: Sequelize.UUID,
        allowNull: false,
        defaultValue: Sequelize.UUIDV4,
        unique: true,
      },
      firstName: {
        type: Sequelize.STRING,
        allowNull: true,
        validate: {
          notEmpty: false,
        },
      },
      lastName: {
        type: Sequelize.STRING,
        allowNull: true,
        validate: {
          notEmpty: false,
        },
      },
      about: Sequelize.TEXT,
      gender: Sequelize.STRING,
      imageUrl: Sequelize.TEXT,
      phone: Sequelize.STRING,
      birthday: Sequelize.DATE,
      email: {
        type: Sequelize.STRING,
        unique: true,
        allowNull: false,
        validate: {
          isEmail: true,
        },
      },
      password: Sequelize.STRING,
      role: {
        type: Sequelize.STRING,
        allowNull: true,
        defaultValue: "user"
      },
      businessName: Sequelize.STRING,
      relevantBook: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      interestingBook: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      message: {
        type: Sequelize.BOOLEAN,
        defaultValue: true,
      },
      downVoteMyComment: {
        type: Sequelize.BOOLEAN,
        defaultValue: true,
      },
      upVoteMyComment: {
        type: Sequelize.BOOLEAN,
        defaultValue: true,
      },
      replyMyComment: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      commentMyReview: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      followsMe: {
        type: Sequelize.BOOLEAN,
        defaultValue: true,
      },
      deliveryMeetupEnabled: {
        type: Sequelize.BOOLEAN,
        defaultValue: true,
      },
      deliveryShippingEnabled: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      deliveryShippingInfo: Sequelize.STRING,
      deliveryShippingDuration: Sequelize.STRING,
      deliveryShippingPolicy: Sequelize.STRING,
      paymentCustomerId: Sequelize.STRING,
      countFollowers: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
      },
      countFollowingAuthors: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
      },
      countFollowings: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
      },
      active: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
      provider: Sequelize.STRING,
      salt: Sequelize.STRING,
      googleId: {
        type: Sequelize.STRING,
        unique: true,
      },
      googleUrl: Sequelize.STRING,
      googleDisplayName: Sequelize.STRING,
      googleLanguage: Sequelize.STRING,
      facebookId: {
        type: Sequelize.STRING,
        unique: true,
      },
      facebookEmail: Sequelize.STRING,
      facebookName: Sequelize.STRING,
      twitterId: {
        type: Sequelize.STRING,
        unique: true,
      },
      twitterUrl: Sequelize.STRING,
      twitterDisplayName: Sequelize.STRING,
      twitterLanguage: Sequelize.STRING,
      githubId: {
        type: Sequelize.STRING,
        unique: true,
      },
      githubUrl: Sequelize.STRING,
      githubDisplayName: Sequelize.STRING,
      githubLanguage: Sequelize.STRING,
      paypal: Sequelize.STRING,
      language: {
        type: Sequelize.STRING(10),
        validate: {
          notEmpty: true,
          isIn: [['en', 'no', 'sv']],
        },
      },
      currency: {
        type: Sequelize.STRING(10),
        allowNull: false,
        validate: {
          notEmpty: true,
          isIn: [['SEK', 'NOK', 'EUR', 'USD', 'sek', 'nok', 'eur', 'usd']]
        },
      },
      deviceService: {
        type: Sequelize.STRING(50),
        validate: {
          notEmpty: true,
          isIn: [['fcm', 'apns']],
        },
      },
      deviceToken: {
        type: Sequelize.STRING,
      },
      receiveNotifications: {
        type: Sequelize.BOOLEAN,
        defaultValue: true,
      },
      verifiedMerchant: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      subscribeToMarketingEmailEnabled: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      showFullNameEnabled: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      acceptedTerms: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      emailVerified: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      deactivatedAt: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      pointOfRegistration: Sequelize.STRING,
      countBookshelf: {
        type: Sequelize.INTEGER,
        defaultValue: 0
      },
      countSales: {
        type: Sequelize.INTEGER,
        defaultValue: 0
      },
      countWishlist: {
        type: Sequelize.INTEGER,
        defaultValue: 0
      },
      pendingVerification: {
        type: Sequelize.BOOLEAN,
        defaultValue: true
      },
      salesVolume: {
        type: Sequelize.STRING(10),
        validate: {
          notEmpty: true,
          isIn: [['high', 'low']],
        },
      },
    },
    {
      sequelize,
      paranoid: false,
      timestamps: true,
      tableName: 'User',
    }
  )
  User.associate = () => {
    const db = sequelize.models
    db.User.belongsTo(db.PaymentAccount)
    db.User.belongsToMany(db.Address, { through: db.UserAddress })
    db.User.belongsToMany(db.PayMethod, {
      as: 'Payment',
      through: db.UserPaymentMethod,
    })
    db.User.belongsToMany(db.PayMethod, {
      as: 'Payout',
      through: db.UserPayoutMethod,
    })
    db.User.belongsToMany(db.User, {
      as: 'Following',
      through: db.UserFollowing,
      foreignKey: 'FollowerId',
    })
    db.User.belongsToMany(db.User, {
      as: 'Follower',
      through: db.UserFollowing,
      foreignKey: 'UserId',
    })
    db.User.belongsToMany(db.Author, {
      through: db.AuthorFollowing,
      foreignKey: 'FollowerId',
    })
    db.User.belongsTo(db.Country)
    db.User.belongsTo(db.Author)
    db.User.hasMany(db.Sale, { foreignKey: 'SellerId' })
    db.User.hasMany(db.Book, { foreignKey: 'CreatorId' })
    db.User.hasMany(db.BookRating)
    db.User.hasOne(db.UserSocial)
  }
  return User
}
