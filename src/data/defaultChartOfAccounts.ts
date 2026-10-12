import { Account } from '../types/accounting';

export const DEFAULT_CHART_OF_ACCOUNTS: Account[] = [
  // 1. دارایی‌های جاری (101 - 119)
  {
    code: '101',
    name: 'موجودی نقد و بانک (صندوق)',
    category: 'asset',
    subCategory: 'current_asset',
    nature: 'debit',
    isPermanent: true,
    description: 'وجوه نقد، تنخواه‌گردان و صندوق شرکت'
  },
  {
    code: '102',
    name: 'حساب‌های بانکی',
    category: 'asset',
    subCategory: 'current_asset',
    nature: 'debit',
    isPermanent: true,
    description: 'موجودی حساب‌های جاری و پس‌انداز نزد بانک‌ها'
  },
  {
    code: '103',
    name: 'حساب‌های دریافتنی تجاری',
    category: 'asset',
    subCategory: 'current_asset',
    nature: 'debit',
    isPermanent: true,
    description: 'طلب از مشتریان ناشی از فروش نسیه کالا یا خدمات'
  },
  {
    code: '104',
    name: 'اسناد دریافتنی تجاری (چک‌ها)',
    category: 'asset',
    subCategory: 'current_asset',
    nature: 'debit',
    isPermanent: true,
    description: 'چک‌ها و سفته‌های دریافتنی نزد صندوق یا در جریان وصول'
  },
  {
    code: '105',
    name: 'پیش‌پرداخت‌ها (بیمه / اجاره)',
    category: 'asset',
    subCategory: 'current_asset',
    nature: 'debit',
    isPermanent: true,
    description: 'پیش‌پرداخت اجاره، بیمه و هزینه‌های آتی مشمول تعدیل پایان دوره'
  },
  {
    code: '106',
    name: 'ملزومات اداری و مصرفی',
    category: 'asset',
    subCategory: 'current_asset',
    nature: 'debit',
    isPermanent: true,
    description: 'لوازم‌التحریر و ملزومات خریداری شده نیازمند ثبت اصلاحی مصرف'
  },
  {
    code: '107',
    name: 'موجودی کالا',
    category: 'asset',
    subCategory: 'current_asset',
    nature: 'debit',
    isPermanent: true,
    description: 'موجودی کالای آماده برای فروش در شرکت‌های بازرگانی'
  },

  // 2. دارایی‌های غیرجاری (ثابت) (121 - 139)
  {
    code: '121',
    name: 'زمین',
    category: 'asset',
    subCategory: 'non_current_asset',
    nature: 'debit',
    isPermanent: true,
    description: 'زمین ملکی شرکت (فاقد استهلاک)'
  },
  {
    code: '122',
    name: 'ساختمان',
    category: 'asset',
    subCategory: 'non_current_asset',
    nature: 'debit',
    isPermanent: true,
    description: 'ساختمان‌های ملکی شرکت'
  },
  {
    code: '123',
    name: 'استهلاک انباشته ساختمان (کاهنده دارایی)',
    category: 'asset',
    subCategory: 'non_current_asset',
    nature: 'credit',
    isPermanent: true,
    description: 'حساب کاهنده ارزش دفتری ساختمان'
  },
  {
    code: '124',
    name: 'اثاثه و تجهیزات اداری',
    category: 'asset',
    subCategory: 'non_current_asset',
    nature: 'debit',
    isPermanent: true,
    description: 'میز، صندلی، کامپیوتر و تجهیزات دفتری'
  },
  {
    code: '125',
    name: 'استهلاک انباشته اثاثه (کاهنده دارایی)',
    category: 'asset',
    subCategory: 'non_current_asset',
    nature: 'credit',
    isPermanent: true,
    description: 'حساب کاهنده دارایی برای اثاثه'
  },
  {
    code: '126',
    name: 'وسایط نقلیه',
    category: 'asset',
    subCategory: 'non_current_asset',
    nature: 'debit',
    isPermanent: true,
    description: 'خودروهای شرکت'
  },
  {
    code: '127',
    name: 'استهلاک انباشته وسایط نقلیه (کاهنده دارایی)',
    category: 'asset',
    subCategory: 'non_current_asset',
    nature: 'credit',
    isPermanent: true,
    description: 'حساب کاهنده استهلاک وسایط نقلیه'
  },

  // 3. بدهی‌های جاری (201 - 219)
  {
    code: '201',
    name: 'حساب‌های پرداختنی تجاری (بستانکاران)',
    category: 'liability',
    subCategory: 'current_liability',
    nature: 'credit',
    isPermanent: true,
    description: 'بدهی به تأمین‌کنندگان بابت خرید نسیه کالا یا خدمات'
  },
  {
    code: '202',
    name: 'اسناد پرداختنی تجاری (چک‌های صادره)',
    category: 'liability',
    subCategory: 'current_liability',
    nature: 'credit',
    isPermanent: true,
    description: 'چک‌های صادره بابت خریدها یا تسویه بدهی‌ها'
  },
  {
    code: '203',
    name: 'پیش‌دریافت‌ها (پیش‌دریافت درآمد)',
    category: 'liability',
    subCategory: 'current_liability',
    nature: 'credit',
    isPermanent: true,
    description: 'مبالغ دریافتی از مشتریان قبل از ارائه خدمات یا تحویل کالا'
  },
  {
    code: '204',
    name: 'حقوق و دستمزد پرداختنی',
    category: 'liability',
    subCategory: 'current_liability',
    nature: 'credit',
    isPermanent: true,
    description: 'حقوق معوق کارکنان شرکت در پایان دوره'
  },
  {
    code: '205',
    name: 'مالیات و عوارض پرداختنی',
    category: 'liability',
    subCategory: 'current_liability',
    nature: 'credit',
    isPermanent: true,
    description: 'مالیات عملکرد یا مالیات بر ارزش افزوده پرداختنی'
  },

  // 4. بدهی‌های بلندمدت (221 - 239)
  {
    code: '221',
    name: 'تسهیلات و وام‌های بانکی بلندمدت',
    category: 'liability',
    subCategory: 'long_term_liability',
    nature: 'credit',
    isPermanent: true,
    description: 'وام‌های سررسید بیش از یک سال'
  },

  // 5. حقوق صاحبان سهام و سرمایه (301 - 319)
  {
    code: '301',
    name: 'سرمایه اولیه',
    category: 'equity',
    subCategory: 'equity',
    nature: 'credit',
    isPermanent: true,
    description: 'سرمایه اولیه آورده مالکان و شرکا'
  },
  {
    code: '302',
    name: 'برداشت شخصی مالک',
    category: 'equity',
    subCategory: 'equity',
    nature: 'debit',
    isPermanent: false,
    description: 'برداشت‌های شخصی مالک از دارایی‌های مؤسسه'
  },
  {
    code: '303',
    name: 'سود و زیان انباشته',
    category: 'equity',
    subCategory: 'equity',
    nature: 'credit',
    isPermanent: true,
    description: 'سودهای انباشته انباشت‌شده از دوره‌های قبل'
  },
  {
    code: '304',
    name: 'خلاصه سود و زیان (حساب واسطه بستن)',
    category: 'equity',
    subCategory: 'equity',
    nature: 'credit',
    isPermanent: false,
    description: 'حساب واسطه پایان سال جهت بستن حساب‌های درآمد و هزینه'
  },

  // 6. درآمدها (401 - 419)
  {
    code: '401',
    name: 'درآمد ارائه خدمات',
    category: 'revenue',
    subCategory: 'operating_revenue',
    nature: 'credit',
    isPermanent: false,
    description: 'درآمد ناشی از ارائه خدمات به مشتریان در شرکت‌های خدماتی'
  },
  {
    code: '402',
    name: 'فروش ناخالص کالا',
    category: 'revenue',
    subCategory: 'operating_revenue',
    nature: 'credit',
    isPermanent: false,
    description: 'فروش کالاهای بازرگانی'
  },
  {
    code: '403',
    name: 'برگشت از فروش و تخفیفات (کاهنده درآمد)',
    category: 'revenue',
    subCategory: 'sales_discount_return',
    nature: 'debit',
    isPermanent: false,
    description: 'کالاهای برگشتی از مشتریان یا تخفیفات اعطایی تجاری'
  },
  {
    code: '404',
    name: 'تخفیفات نقدی فروش (کاهنده درآمد)',
    category: 'revenue',
    subCategory: 'sales_discount_return',
    nature: 'debit',
    isPermanent: false,
    description: 'تخفیفات نقدی به دلیل تسویه زودهنگام مشتریان'
  },

  // 7. خرید و بهای تمام شده کالای فروش رفته (501 - 519)
  {
    code: '501',
    name: 'خرید ناخالص کالا (روش ادواری)',
    category: 'cogs',
    subCategory: 'purchases_cogs',
    nature: 'debit',
    isPermanent: false,
    description: 'خرید کالای بازرگانی در سیستم ثبت ادواری'
  },
  {
    code: '502',
    name: 'هزینه حمل کالای خریداری شده',
    category: 'cogs',
    subCategory: 'purchases_cogs',
    nature: 'debit',
    isPermanent: false,
    description: 'کرایه حمل کالاهای خریداری شده (افزاینده بهای تمام شده)'
  },
  {
    code: '503',
    name: 'برگشت از خرید و تخفیفات (کاهنده خرید)',
    category: 'cogs',
    subCategory: 'purchases_cogs',
    nature: 'credit',
    isPermanent: false,
    description: 'کالاهای عودت داده شده به فروشندگان'
  },
  {
    code: '504',
    name: 'تخفیفات نقدی خرید (کاهنده خرید)',
    category: 'cogs',
    subCategory: 'purchases_cogs',
    nature: 'credit',
    isPermanent: false,
    description: 'تخفیف به علت پرداخت سریع فاکتور خرید'
  },
  {
    code: '505',
    name: 'بهای تمام شده کالای فروش رفته (COGS)',
    category: 'cogs',
    subCategory: 'purchases_cogs',
    nature: 'debit',
    isPermanent: false,
    description: 'بهای تمام شده کالای خارج شده از انبار بابت فروش'
  },

  // 8. هزینه‌های عملیاتی و اداری (601 - 630)
  {
    code: '601',
    name: 'هزینه حقوق و دستمزد',
    category: 'expense',
    subCategory: 'operating_expense',
    nature: 'debit',
    isPermanent: false,
    description: 'حقوق پرسنل و کارکنان'
  },
  {
    code: '602',
    name: 'هزینه اجاره محل',
    category: 'expense',
    subCategory: 'operating_expense',
    nature: 'debit',
    isPermanent: false,
    description: 'اجاره دفتر یا فروشگاه'
  },
  {
    code: '603',
    name: 'هزینه استهلاک دارایی‌های ثابت',
    category: 'expense',
    subCategory: 'operating_expense',
    nature: 'debit',
    isPermanent: false,
    description: 'استهلاک دوره ساختمان، تجهیزات و خودروها'
  },
  {
    code: '604',
    name: 'هزینه ملزومات مصرف شده',
    category: 'expense',
    subCategory: 'operating_expense',
    nature: 'debit',
    isPermanent: false,
    description: 'ملزومات مصرف شده در طول دوره مالی'
  },
  {
    code: '605',
    name: 'هزینه آب، برق، گاز و تلفن',
    category: 'expense',
    subCategory: 'operating_expense',
    nature: 'debit',
    isPermanent: false,
    description: 'قبوض مصارف عمومی'
  },
  {
    code: '606',
    name: 'هزینه بیمه',
    category: 'expense',
    subCategory: 'operating_expense',
    nature: 'debit',
    isPermanent: false,
    description: 'حق بیمه منقضی شده طی دوره'
  },
  {
    code: '607',
    name: 'هزینه تبلیغات و بازاریابی',
    category: 'expense',
    subCategory: 'operating_expense',
    nature: 'debit',
    isPermanent: false,
    description: 'تبلیغات و جذب مشتری'
  },
  {
    code: '608',
    name: 'هزینه حمل و نقل فروش (توزیع)',
    category: 'expense',
    subCategory: 'operating_expense',
    nature: 'debit',
    isPermanent: false,
    description: 'کرایه ارسال کالا به خریداران'
  },
  {
    code: '609',
    name: 'سایر هزینه‌های عمومی و متفرقه',
    category: 'expense',
    subCategory: 'operating_expense',
    nature: 'debit',
    isPermanent: false,
    description: 'هزینه‌های پذیرایی، ایاب و ذهاب و نگهداری'
  }
];
