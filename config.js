/**
 * Quulay eshik romlari — Sozlamalar (Config)
 * Telefon raqam, xizmat hududlari va Telegram bot sozlamalarini shu yerdan osongina o'zgartirishingiz mumkin.
 */
window.QUULAY_CONFIG = {
  brandName: "Quulay",
  brandSubtitle: "eshik romlari",

  // Call center raqami (haqiqiy operator raqami)
  phoneDisplay: "+998 94 479 25 21",
  phoneHref: "tel:+998944792521",

  // Standart dizayn mavzusi: "orange" (1-dizayn) yoki "brand" (2-dizayn — logotip ranglari)
  defaultTheme: "orange",

  // Ish vaqti
  workHours: "Har kuni 08:00 – 20:00",

  // Xizmat ko'rsatiladigan tumanlar (videolardagi haqiqiy obyektlar asosida — Andijon hududi)
  // Istagan tumanni qo'shish yoki olib tashlash mumkin.
  serviceDistricts: [
    "Andijon shahri",
    "Andijon tumani",
    "Asaka tumani",
    "Izboskan tumani",
    "Paxtaobod tumani",
    "Shahrixon tumani",
    "Oltinko'l tumani",
    "Xo'jaobod tumani"
  ],

  // Boshqa hudud tanlanganda ko'rsatiladigan matn
  unsupportedAreaTitle: "Bu hududga hozircha xizmat ko'rsatmaymiz",
  unsupportedAreaDesc:
    "Hozirda bepul zamer va o'rnatish xizmatimiz faqat quyida ko'rsatilgan Andijon hududlarida amal qiladi. Yaqin orada boshqa hududlarga ham kengayamiz!",

  // Real montaj videolarini 3D kartochkalar ichida qo'shimcha tugma sifatida ko'rsatish (true / false)
  // Agar faqat 3D renderlar ko'rinsin desangiz, false qiling.
  showRealVideos: true,

  // Telegram Bot orqali arizalarni qabul qilish (ixtiyoriy — to'ldirilsa arizalar darhol Telegramga boradi)
  telegramBotToken: "", // Masalan: "123456789:ABCDefGhIjKlMnOpQrStUvWxYz"
  telegramChatId: ""    // Masalan: "-1001234567890" yoki shaxsiy chat ID
};
