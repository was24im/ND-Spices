export interface TranslationDict {
  nav: {
    home: string;
    exploreSpices: string;
    allSpices: string;
    purePowders: string;
    wholeSpices: string;
    masalaBlends: string;
    search: string;
    searchPlaceholder: string;
    basket: string;
    wishlist: string;
    signIn: string;
    myAccount: string;
    orderHistory: string;
    signOut: string;
    adminPortal: string;
    tagline: string;
    langSwitch: string;
    b2bWholesale: string;
  };
  hero: {
    badge: string;
    heading: string;
    headingHighlight: string;
    subheading: string;
    primaryCta: string;
    secondaryCta: string;
    stat1Value: string;
    stat1Label: string;
    stat2Value: string;
    stat2Label: string;
    stat3Value: string;
    stat3Label: string;
    qualityBadgeTitle: string;
    qualityBadgeDesc: string;
  };
  categories: {
    title: string;
    subtitle: string;
    viewAll: string;
    wholeRedChilli: {
      name: string;
      desc: string;
    };
    redChilliPowder: {
      name: string;
      desc: string;
    };
    corianderSeeds: {
      name: string;
      desc: string;
    };
    corianderPowder: {
      name: string;
      desc: string;
    };
    turmericFinger: {
      name: string;
      desc: string;
    };
    turmericPowder: {
      name: string;
      desc: string;
    };
    kasuriMethi: {
      name: string;
      desc: string;
    };
    jeera: {
      name: string;
      desc: string;
    };
  };
  home: {
    featuredTitle: string;
    featuredSubtitle: string;
    bestsellerTitle: string;
    bestsellerSubtitle: string;
    whyChooseTitle: string;
    whyChooseSubtitle: string;
    qualityTitle: string;
    qualitySubtitle: string;
    contactTitle: string;
    contactSubtitle: string;
    whatsappCta: string;
    bulkInquiryCta: string;
    directFactoryNotice: string;
    whyChoose: {
      f1Title: string;
      f1Desc: string;
      f2Title: string;
      f2Desc: string;
      f3Title: string;
      f3Desc: string;
      f4Title: string;
      f4Desc: string;
    };
    quality: {
      q1Title: string;
      q1Desc: string;
      q2Title: string;
      q2Desc: string;
      q3Title: string;
      q3Desc: string;
      q4Title: string;
      q4Desc: string;
    };
    contact: {
      phoneLabel: string;
      emailLabel: string;
      factoryAddressLabel: string;
      address: string;
      whatsappChat: string;
      b2bText: string;
    };
  };
  catalog: {
    title: string;
    subtitle: string;
    filters: string;
    resetFilters: string;
    category: string;
    allCategories: string;
    packagingSize: string;
    allSizes: string;
    priceRange: string;
    sortBy: string;
    sortFeatured: string;
    sortPriceLow: string;
    sortPriceHigh: string;
    inStockOnly: string;
    showingResults: string;
    addToBasket: string;
    buyNow: string;
    viewDetails: string;
    outOfStock: string;
    inStock: string;
    save: string;
    pack: string;
    origin: string;
  };
  pdp: {
    selectSize: string;
    quantity: string;
    mrp: string;
    ourPrice: string;
    inclusiveOfTaxes: string;
    addedToBasket: string;
    expressDelivery: string;
    labTestedBadge: string;
    singleOriginBadge: string;
    tabOrigin: string;
    tabUsage: string;
    tabHealth: string;
    tabLabReport: string;
    relatedTitle: string;
    reviewsTitle: string;
  };
  cart: {
    title: string;
    emptyTitle: string;
    emptyDesc: string;
    startShopping: string;
    orderSummary: string;
    subtotal: string;
    shipping: string;
    freeShipping: string;
    total: string;
    checkout: string;
    continueShopping: string;
    couponCode: string;
    apply: string;
  };
  checkout: {
    title: string;
    shippingAddress: string;
    fullName: string;
    phone: string;
    street: string;
    city: string;
    state: string;
    pincode: string;
    paymentMode: string;
    onlinePayment: string;
    codPayment: string;
    placeOrder: string;
    secureNotice: string;
  };
  footer: {
    brandDesc: string;
    quickLinks: string;
    categories: string;
    contactSupport: string;
    allRightsReserved: string;
    fssaiLicense: string;
    gstin: string;
  };
}

export const TRANSLATIONS: { en: TranslationDict; hi: TranslationDict } = {
  en: {
    nav: {
      home: "Home",
      exploreSpices: "Explore Spices",
      allSpices: "All Spices",
      purePowders: "Pure Powders",
      wholeSpices: "Whole Spices",
      masalaBlends: "Masala Blends",
      search: "Search",
      searchPlaceholder: "Search pure red chilli, turmeric, coriander, jeera...",
      basket: "Basket",
      wishlist: "Wishlist",
      signIn: "Sign In",
      myAccount: "My Account",
      orderHistory: "Order History",
      signOut: "Sign Out",
      adminPortal: "Admin Portal",
      tagline: "Pure Indian Spices",
      langSwitch: "English | हिंदी",
      b2bWholesale: "Wholesale & B2B",
    },
    hero: {
      badge: "Direct From Rajasthan & Heritage Estates • Lab-Tested 100% Pure",
      heading: "Pure Indian Spices,",
      headingHighlight: "Authentic Stone-Ground Purity.",
      subheading:
        "Harvested from certified Indian spice farms and stone-ground at low temperatures. Free from artificial colors, chemical preservatives, fillers, and adulterants.",
      primaryCta: "Shop Spice Varieties",
      secondaryCta: "Explore Pure Powders",
      stat1Value: "100%",
      stat1Label: "Pure & Unadulterated",
      stat2Value: "₹30+",
      stat2Label: "Factory Direct Rates",
      stat3Value: "0%",
      stat3Label: "Added Colors / Starch",
      qualityBadgeTitle: "Pure & Lab Certified",
      qualityBadgeDesc: "Cold stone-ground with zero lead chromate, chalk, or artificial fillers.",
    },
    categories: {
      title: "Shop by Category",
      subtitle: "Handpicked whole spices, stone-ground powders, and authentic Indian aromatics",
      viewAll: "View All Products",
      wholeRedChilli: {
        name: "Whole Red Chilli",
        desc: "Authentic sun-dried whole red chillies including Kashmiri Dabi, Byadgi, Teja, and DD varieties.",
      },
      redChilliPowder: {
        name: "Red Chilli Powder",
        desc: "Stone-ground pure red chilli powders offering natural vibrant red color and rich spicy warmth.",
      },
      corianderSeeds: {
        name: "Coriander Seeds",
        desc: "Premium machine-cleaned bold coriander seeds: Eigle, Scooter, Double Perrote, and Badami.",
      },
      corianderPowder: {
        name: "Coriander Powder",
        desc: "Cold-milled fragrant coriander powder with high natural volatile essential oils.",
      },
      turmericFinger: {
        name: "Turmeric Finger",
        desc: "High-curcumin whole turmeric fingers from Nizamabad, Sangli, and Erode harvests.",
      },
      turmericPowder: {
        name: "Turmeric Powder",
        desc: "Golden pure turmeric powder ground from selected fingers with no artificial coloring.",
      },
      kasuriMethi: {
        name: "Kasuri Methi",
        desc: "Pan-dried aromatic green fenugreek leaves handpicked from Rajasthan's Nagaur district.",
      },
      jeera: {
        name: "Jeera (Cumin Seeds)",
        desc: "Machine-cleaned, bold and aromatic Gujarat and Rajasthan whole cumin seeds.",
      },
    },
    home: {
      featuredTitle: "Featured Spice Varieties",
      featuredSubtitle: "Carefully curated regional spice specialties straight from Indian mandis and farms",
      bestsellerTitle: "Best-Selling Products",
      bestsellerSubtitle: "Trusted daily by households, restaurants, and spice connoisseurs across India",
      whyChooseTitle: "Why Choose ND Spices",
      whyChooseSubtitle: "We preserve centuries of traditional Indian spice heritage with modern lab purity",
      qualityTitle: "Our Commitment to Quality",
      qualitySubtitle: "Every batch is inspected, tested, and sealed at source for unmatched aroma and freshness",
      contactTitle: "Contact & Wholesale Inquiries",
      contactSubtitle: "Get in touch for wholesale bulk quantities, B2B pricing, or customer support",
      whatsappCta: "Chat on WhatsApp",
      bulkInquiryCta: "Send Bulk Inquiry",
      directFactoryNotice: "Direct factory pricing for retail and wholesale buyers across India",
      whyChoose: {
        f1Title: "100% Single-Origin Pure",
        f1Desc: "Directly sourced from dedicated growing regions without blending cheap residual crops.",
        f2Title: "Zero Artificial Colorants",
        f2Desc: "Never adulterated with lead chromate, Sudan red dye, metanil yellow, or chalk powder.",
        f3Title: "Slow Stone-Ground Milling",
        f3Desc: "Milled at controlled low temperatures under 35°C to protect precious volatile essential oils.",
        f4Title: "Transparent Packaging",
        f4Desc: "Available in multiple hygienic packs (100g to 1kg) with clear weights and fair pricing.",
      },
      quality: {
        q1Title: "FSSAI & AGMARK Standards",
        q1Desc: "Compliant with strict Indian food safety norms and hygiene protocols at every processing step.",
        q2Title: "Rigorous Lab Screening",
        q2Desc: "Tested for pesticide residues, heavy metals, moisture content, and volatile oil percentage.",
        q3Title: "Machine Cleaned & Graded",
        q3Desc: "Triple-sieved to remove dust, stones, stems, and foreign particles before milling or packing.",
        q4Title: "Aroma-Lock Fresh Packing",
        q4Desc: "Food-grade airtight moisture barrier packaging seals in natural fragrance and freshness.",
      },
      contact: {
        phoneLabel: "Phone / Support",
        emailLabel: "Email Inquiries",
        factoryAddressLabel: "Processing Unit & Address",
        address: "Sherani Jamat Khana Ke Paas, Noori Mohalla, Sherani Abad, Didwana Kuchaman, Nagaur, Rajasthan - 341302",
        whatsappChat: "Quick WhatsApp Support",
        b2bText: "Looking for commercial 25kg / 50kg bags for mills, hotels, or catering? Contact our sales desk.",
      },
    },
    catalog: {
      title: "All Spices & Varieties",
      subtitle: "Explore authentic Indian whole chillies, powders, coriander seeds, turmeric, jeera & kasuri methi",
      filters: "Filter Spices",
      resetFilters: "Reset Filters",
      category: "Category",
      allCategories: "All Categories",
      packagingSize: "Packaging Size",
      allSizes: "All Sizes",
      priceRange: "Max Price",
      sortBy: "Sort By",
      sortFeatured: "Featured Varieties",
      sortPriceLow: "Price: Low to High",
      sortPriceHigh: "Price: High to Low",
      inStockOnly: "In Stock Only",
      showingResults: "Showing products",
      addToBasket: "Add to Basket",
      buyNow: "Buy Now",
      viewDetails: "View Variety",
      outOfStock: "Out of Stock",
      inStock: "In Stock",
      save: "Save",
      pack: "Pack",
      origin: "Origin",
    },
    pdp: {
      selectSize: "Select Packaging Size",
      quantity: "Quantity",
      mrp: "M.R.P.",
      ourPrice: "Special Price",
      inclusiveOfTaxes: "Inclusive of all taxes",
      addedToBasket: "Added to Basket!",
      expressDelivery: "Fast Dispatch across India",
      labTestedBadge: "100% Lab Tested & Pure",
      singleOriginBadge: "Certified Origin Harvest",
      tabOrigin: "Origin & Sourcing",
      tabUsage: "Culinary Uses & Profile",
      tabHealth: "Health & Essential Oils",
      tabLabReport: "Purity & Quality Specs",
      relatedTitle: "Related Spice Varieties",
      reviewsTitle: "Verified Customer Reviews",
    },
    cart: {
      title: "Your Shopping Basket",
      emptyTitle: "Your basket is empty",
      emptyDesc: "You haven't added any pure spices to your basket yet.",
      startShopping: "Explore Spices",
      orderSummary: "Order Summary",
      subtotal: "Subtotal",
      shipping: "Shipping",
      freeShipping: "Free Delivery",
      total: "Total Payable",
      checkout: "Proceed to Checkout",
      continueShopping: "Continue Shopping",
      couponCode: "Coupon Code",
      apply: "Apply",
    },
    checkout: {
      title: "Complete Your Order",
      shippingAddress: "Shipping Details",
      fullName: "Full Name",
      phone: "Mobile Phone Number",
      street: "House / Flat No., Street, Landmark",
      city: "City / Town",
      state: "State",
      pincode: "Postal PIN Code",
      paymentMode: "Payment Method",
      onlinePayment: "Online Payment (UPI, Cards, NetBanking)",
      codPayment: "Cash on Delivery (COD)",
      placeOrder: "Confirm & Place Order",
      secureNotice: "Safe and encrypted checkout powered by Razorpay",
    },
    footer: {
      brandDesc:
        "ND Spices is a premier manufacturer and supplier of authentic Indian single-origin whole spices and cold stone-ground powders based in Nagaur, Rajasthan.",
      quickLinks: "Quick Links",
      categories: "Spice Categories",
      contactSupport: "Customer Support",
      allRightsReserved: "All rights reserved. ND Spices.",
      fssaiLicense: "FSSAI Lic. No.: 12221004000182",
      gstin: "GSTIN: 08AABCU9603R1ZM",
    },
  },
  hi: {
    nav: {
      home: "होम",
      exploreSpices: "मसाले देखें",
      allSpices: "सभी मसाले",
      purePowders: "शुद्ध पिसे मसाले",
      wholeSpices: "साबुत मसाले",
      masalaBlends: "मसाला मिश्रण",
      search: "खोजें",
      searchPlaceholder: "शुद्ध लाल मिर्च, हल्दी, धनिया, जीरा खोजें...",
      basket: "टोकरी",
      wishlist: "पसंदीदा",
      signIn: "लॉग इन",
      myAccount: "मेरा खाता",
      orderHistory: "ऑर्डर इतिहास",
      signOut: "लॉग आउट",
      adminPortal: "एडमिन पैनल",
      tagline: "शुद्ध भारतीय मसाले",
      langSwitch: "English | हिंदी",
      b2bWholesale: "थोक व बी2बी व्यापार",
    },
    hero: {
      badge: "राजस्थान व प्रमुख खेतों से सीधा • लैब प्रमाणित 100% शुद्ध",
      heading: "शुद्ध भारतीय मसाले,",
      headingHighlight: "पारंपरिक पत्थर पिसाई का असली स्वाद।",
      subheading:
        "प्रमाणित भारतीय खेतों से सीधे खरीदे गए और धीमी गति से पत्थर से पिसे मसाले। कृत्रिम रंगों, रसायनों, मिलावट और स्टार्च से पूरी तरह मुक्त।",
      primaryCta: "मसालों की किस्में देखें",
      secondaryCta: "शुद्ध पिसे मसाले",
      stat1Value: "100%",
      stat1Label: "पूर्णतः शुद्ध व बिना मिलावट",
      stat2Value: "₹30+",
      stat2Label: "सीधे फैक्ट्री दरें",
      stat3Value: "0%",
      stat3Label: "कृत्रिम रंग या स्टार्च",
      qualityBadgeTitle: "शुद्ध व लैब प्रमाणित",
      qualityBadgeDesc: "धीमी पत्थर पिसाई, लेड क्रोमेट और हानिकारक रसायनों से पूर्णतः मुक्त।",
    },
    categories: {
      title: "श्रेणियों के अनुसार खरीदें",
      subtitle: "हाथ से चुने गए साबुत मसाले, शुद्ध पिसे पाउडर और सुगंधित भारतीय मसाले",
      viewAll: "सभी उत्पाद देखें",
      wholeRedChilli: {
        name: "साबुत लाल मिर्च",
        desc: "धूप में सुखाई गई प्रामाणिक साबुत लाल मिर्च: कश्मीरी डाबी, ब्याडगी, तेजा, डीडी व अन्य किस्में।",
      },
      redChilliPowder: {
        name: "लाल मिर्च पाउडर",
        desc: "पत्थर से पिसा शुद्ध लाल मिर्च पाउडर, जो दे प्राकृतिक गहरा लाल रंग और तीखापन।",
      },
      corianderSeeds: {
        name: "साबुत धनिया",
        desc: "मशीन से साफ किया हुआ प्रीमियम साबुत धनिया: ईगल, स्कूटर, डबल तोता और बादामी।",
      },
      corianderPowder: {
        name: "धनिया पाउडर",
        desc: "धीमी गति से पिसा सुगंधित धनिया पाउडर, जिसमें प्राकृतिक तेल पूरी तरह सुरक्षित रहता है।",
      },
      turmericFinger: {
        name: "साबुत हल्दी (गांठ)",
        desc: "उच्च करक्यूमिन युक्त साबुत हल्दी गांठ: निजामाबाद, सांगली और इरोड की प्रसिद्ध किस्में।",
      },
      turmericPowder: {
        name: "हल्दी पाउडर",
        desc: "चुनिंदा हल्दी गांठों से पिसा शुद्ध हल्दी पाउडर, बिना किसी कृत्रिम रंग या मिलावट के।",
      },
      kasuriMethi: {
        name: "कसूरी मेथी",
        desc: "राजस्थान के नागौर जिले की प्रसिद्ध, छाया में सुखाई गई बेहद खुशबूदार हरी कसूरी मेथी।",
      },
      jeera: {
        name: "साबुत जीरा",
        desc: "मशीन द्वारा साफ किया हुआ, बोल्ड दानों वाला राजस्थान और गुजरात का शुद्ध जीरा।",
      },
    },
    home: {
      featuredTitle: "विशेष चुनिंदा मसाले",
      featuredSubtitle: "भारत की प्रमुख मंडियों और खेतों से चुने गए सर्वोत्तम मसाले",
      bestsellerTitle: "सर्वाधिक बिकने वाले मसाले",
      bestsellerSubtitle: "भारतभर के परिवारों और होटलों द्वारा प्रतिदिन भरोसेमंद उत्पाद",
      whyChooseTitle: "एनडी स्पाइसेस ही क्यों चुनें?",
      whyChooseSubtitle: "हम भारतीय मसालों की सदियों पुरानी परंपरा को आधुनिक लैब शुद्धता के साथ लाते हैं",
      qualityTitle: "हमारी गुणवत्ता का संकल्प",
      qualitySubtitle: "प्रत्येक लॉट का कड़ा लैब परीक्षण कर सुरक्षित रूप से पैक किया जाता है",
      contactTitle: "संपर्क एवं थोक व्यापार पूछताछ",
      contactSubtitle: "होलसेल, कैटरिंग और बी2बी थोक दरों के लिए हमसे तुरंत संपर्क करें",
      whatsappCta: "व्हाट्सएप पर बात करें",
      bulkInquiryCta: "थोक पूछताछ भेजें",
      directFactoryNotice: "खुदरा और थोक ग्राहकों के लिए सीधे फैक्ट्री भाव पर उपलब्ध",
      whyChoose: {
        f1Title: "100% एकल स्रोत शुद्धता",
        f1Desc: "सीधे निश्चित उत्पादक क्षेत्रों से खरीदा जाता है, किसी भी घटिया माल की मिलावट नहीं।",
        f2Title: "शून्य कृत्रिम रंग",
        f2Desc: "सूडान रेड, मेटानिल येलो या लेड क्रोमेट जैसे हानिकारक रंगों से बिल्कुल मुक्त।",
        f3Title: "धीमी पत्थर पिसाई",
        f3Desc: "35°C से कम तापमान पर पिसाई, जिससे मसालों के जरूरी वाष्पशील तेल व खुशबू बची रहे।",
        f4Title: "सटीक व पारदर्शी पैकिंग",
        f4Desc: "100 ग्राम से 1 किलोग्राम तक के स्वच्छ पैकेट, सही वजन और उचित मूल्य पर।",
      },
      quality: {
        q1Title: "FSSAI एवं AGMARK मानक",
        q1Desc: "भारतीय खाद्य सुरक्षा मानकों और उच्चतम स्वच्छता नियमों का कड़ाई से पालन।",
        q2Title: "कठोर लैब परीक्षण",
        q2Desc: "कीटनाशक, भारी धातु, नमी और तेल की मात्रा के लिए आधुनिक प्रयोगशाला में जांच।",
        q3Title: "मशीन द्वारा सफाई व ग्रेडिंग",
        q3Desc: "पिसाई और पैकिंग से पहले धूल, कंकड़, डंठल और कचरा पूरी तरह हटाने के लिए तीन बार छनाई।",
        q4Title: "खुशबू सुरक्षित एयरटाइट पैकिंग",
        q4Desc: "खाद्य-सुरक्षित पैकेट जो मसालों की ताजगी और असली खुशबू को लंबे समय तक बनाए रखते हैं।",
      },
      contact: {
        phoneLabel: "फोन / सहायता",
        emailLabel: "ईमेल पूछताछ",
        factoryAddressLabel: "फैक्ट्री व कार्यालय का पता",
        address: "शेरानी जमात खाना के पास, नूरी मोहल्ला, शेरानी आबाद, डीडवाना कुचामन, नागौर, राजस्थान - 341302",
        whatsappChat: "व्हाट्सएप पर त्वरित सहायता",
        b2bText: "क्या आपको होटल, मिल या कैटरिंग के लिए 25 किग्रा / 50 किग्रा के थोक बैग चाहिए? संपर्क करें।",
      },
    },
    catalog: {
      title: "मसाले और उनकी किस्में",
      subtitle: "साबुत मिर्च, पिसे मसाले, धनिया बीज, हल्दी गांठ, जीरा और कसूरी मेथी की संपूर्ण श्रृंखला",
      filters: "मसाले फ़िल्टर करें",
      resetFilters: "फ़िल्टर हटाएं",
      category: "श्रेणी",
      allCategories: "सभी श्रेणियां",
      packagingSize: "पैकिंग साइज",
      allSizes: "सभी साइज",
      priceRange: "अधिकतम कीमत",
      sortBy: "क्रमबद्ध करें",
      sortFeatured: "विशेष किस्में",
      sortPriceLow: "कीमत: कम से अधिक",
      sortPriceHigh: "कीमत: अधिक से कम",
      inStockOnly: "केवल स्टॉक में उपलब्ध",
      showingResults: "दिखाए जा रहे उत्पाद",
      addToBasket: "टोकरी में जोड़ें",
      buyNow: "अभी खरीदें",
      viewDetails: "विवरण देखें",
      outOfStock: "स्टॉक में नहीं",
      inStock: "स्टॉक में उपलब्ध",
      save: "बचत",
      pack: "पैक",
      origin: "उत्पत्ति स्थल",
    },
    pdp: {
      selectSize: "पैकिंग साइज चुनें",
      quantity: "मात्रा",
      mrp: "एम.आर.पी.",
      ourPrice: "विशेष मूल्य",
      inclusiveOfTaxes: "सभी कर सहित",
      addedToBasket: "टोकरी में जोड़ दिया गया!",
      expressDelivery: "संपूर्ण भारत में त्वरित डिलीवरी",
      labTestedBadge: "100% लैब प्रमाणित शुद्ध",
      singleOriginBadge: "प्रामाणिक स्रोत से ताज़ा फसल",
      tabOrigin: "उत्पत्ति एवं स्रोत",
      tabUsage: "रसोई में उपयोग व स्वाद",
      tabHealth: "स्वास्थ्य लाभ व वाष्पशील तेल",
      tabLabReport: "शुद्धता व लैब रिपोर्ट",
      relatedTitle: "संबंधित मसाले",
      reviewsTitle: "सत्यापित ग्राहकों की समीक्षाएं",
    },
    cart: {
      title: "आपकी खरीदारी की टोकरी",
      emptyTitle: "आपकी टोकरी खाली है",
      emptyDesc: "आपने अभी तक अपनी टोकरी में कोई मसाला नहीं जोड़ा है।",
      startShopping: "मसाले खरीदें",
      orderSummary: "ऑर्डर सारांश",
      subtotal: "उप-योग",
      shipping: "डिलीवरी शुल्क",
      freeShipping: "मुफ्त डिलीवरी",
      total: "कुल देय राशि",
      checkout: "चेकआउट के लिए आगे बढ़ें",
      continueShopping: "खरीदारी जारी रखें",
      couponCode: "कूपन कोड",
      apply: "लागू करें",
    },
    checkout: {
      title: "अपना ऑर्डर पूरा करें",
      shippingAddress: "डिलीवरी का पता",
      fullName: "पूरा नाम",
      phone: "मोबाइल नंबर",
      street: "मकान/फ्लैट नं., गली, लैंडमार्क",
      city: "शहर / कस्बा",
      state: "राज्य",
      pincode: "पिन कोड",
      paymentMode: "भुगतान का तरीका",
      onlinePayment: "ऑनलाइन भुगतान (UPI, कार्ड, नेटबैंकिंग)",
      codPayment: "कैश ऑन डिलीवरी (COD)",
      placeOrder: "ऑर्डर की पुष्टि करें",
      secureNotice: "Razorpay द्वारा सुरक्षित और एन्क्रिप्टेड भुगतान",
    },
    footer: {
      brandDesc:
        "एनडी स्पाइसेस नागौर, राजस्थान स्थित शुद्ध भारतीय साबुत मसालों और धीमी पत्थर पिसाई के पाउडर का प्रमुख निर्माता व आपूर्तिकर्ता है।",
      quickLinks: "त्वरित लिंक",
      categories: "मसाला श्रेणियां",
      contactSupport: "ग्राहक सहायता",
      allRightsReserved: "सर्वाधिकार सुरक्षित। एनडी स्पाइसेस।",
      fssaiLicense: "FSSAI लाइसेंस नं.: 12221004000182",
      gstin: "जीएसटीआईएन: 08AABCU9603R1ZM",
    },
  },
};

export type TranslationKeys = keyof TranslationDict;
