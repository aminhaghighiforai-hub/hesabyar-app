import { CompanyProject, JournalEntry, Invoice } from '../types/accounting';

export interface ProjectBundle {
  project: CompanyProject;
  entries: JournalEntry[];
  invoices: Invoice[];
}

export const SAMPLE_PROJECTS: ProjectBundle[] = [
  {
    project: {
      id: 'proj-merchandising-01',
      name: 'شرکت بازرگانی پارس آوا (پروژه کلاسی)',
      type: 'merchandising',
      inventoryMethod: 'periodic',
      fiscalYear: '۱۴۰۳',
      currency: 'toman',
      description: 'پروژه جامع حسابداری شرکت بازرگانی - شامل چرخه کامل خرید و فروش، اسناد اصلاحی و صورت سود و زیان بازرگانی',
      studentName: 'دانشجوی حسابداری',
      courseName: 'اصول حسابداری ۱ و ۲',
      createdAt: '1403/01/01',
      updatedAt: '1403/12/29'
    },
    entries: [
      {
        id: 'entry-1',
        entryNumber: 1,
        date: '1403/01/05',
        description: 'سرمایه‌گذاری اولیه شرکا به صورت نقد در بانک و اثاثه اداری',
        type: 'opening',
        items: [
          { id: 'item-1-1', accountCode: '102', accountName: 'حساب‌های بانکی', debit: 120000000, credit: 0, description: 'واریز نقدی سرمایه به بانک' },
          { id: 'item-1-2', accountCode: '124', accountName: 'اثاثه و تجهیزات اداری', debit: 30000000, credit: 0, description: 'آوردن میز و تجهیزات اداری' },
          { id: 'item-1-3', accountCode: '301', accountName: 'سرمایه اولیه', debit: 0, credit: 150000000, description: 'ثبت سرمایه اولیه شرکا' }
        ],
        createdAt: '1403/01/05'
      },
      {
        id: 'entry-2',
        entryNumber: 2,
        date: '1403/01/10',
        description: 'خرید ملزومات اداری به صورت نقد از محل صندوق',
        type: 'regular',
        items: [
          { id: 'item-2-1', accountCode: '106', accountName: 'ملزومات اداری و مصرفی', debit: 6000000, credit: 0, description: 'خرید کاغذ و نوشت‌افزار' },
          { id: 'item-2-2', accountCode: '102', accountName: 'حساب‌های بانکی', debit: 0, credit: 6000000, description: 'پرداخت از حساب بانک' }
        ],
        createdAt: '1403/01/10'
      },
      {
        id: 'entry-3',
        entryNumber: 3,
        date: '1403/01/15',
        description: 'خرید نسیه کالا از شرکت تأمین کالای البرز',
        type: 'purchase',
        items: [
          { id: 'item-3-1', accountCode: '501', accountName: 'خرید ناخالص کالا (روش ادواری)', debit: 45000000, credit: 0, description: 'خرید کالای بازرگانی فاکتور ۱۰۱' },
          { id: 'item-3-2', accountCode: '201', accountName: 'حساب‌های پرداختنی تجاری (بستانکاران)', debit: 0, credit: 45000000, description: 'طلب شرکت البرز' }
        ],
        createdAt: '1403/01/15'
      },
      {
        id: 'entry-4',
        entryNumber: 4,
        date: '1403/01/18',
        description: 'پرداخت نقدی کرایه حمل کالای خریداری شده',
        type: 'regular',
        items: [
          { id: 'item-4-1', accountCode: '502', accountName: 'هزینه حمل کالای خریداری شده', debit: 2000000, credit: 0, description: 'کرایه حمل کالا به انبار' },
          { id: 'item-4-2', accountCode: '102', accountName: 'حساب‌های بانکی', debit: 0, credit: 2000000, description: 'پرداخت از حساب بانکی' }
        ],
        createdAt: '1403/01/18'
      },
      {
        id: 'entry-5',
        entryNumber: 5,
        date: '1403/01/22',
        description: 'برگشت بخشی از کالای معیوب به شرکت البرز',
        type: 'regular',
        items: [
          { id: 'item-5-1', accountCode: '201', accountName: 'حساب‌های پرداختنی تجاری (بستانکاران)', debit: 5000000, credit: 0, description: 'کاهش بدهی به البرز' },
          { id: 'item-5-2', accountCode: '503', accountName: 'برگشت از خرید و تخفیفات (کاهنده خرید)', debit: 0, credit: 5000000, description: 'برگشت کالای معیوب' }
        ],
        createdAt: '1403/01/22'
      },
      {
        id: 'entry-6',
        entryNumber: 6,
        date: '1403/02/05',
        description: 'فروش نقد و نسیه کالا به بازرگانی سینا (فاکتور فروش ۲۰۱)',
        type: 'sale',
        items: [
          { id: 'item-6-1', accountCode: '102', accountName: 'حساب‌های بانکی', debit: 35000000, credit: 0, description: 'دریافت نقدی در بانک' },
          { id: 'item-6-2', accountCode: '103', accountName: 'حساب‌های دریافتنی تجاری', debit: 35000000, credit: 0, description: 'طلب از بازرگانی سینا' },
          { id: 'item-6-3', accountCode: '402', accountName: 'فروش ناخالص کالا', debit: 0, credit: 70000000, description: 'فروش کالا طبق فاکتور ۲۰۱' }
        ],
        createdAt: '1403/02/05'
      },
      {
        id: 'entry-7',
        entryNumber: 7,
        date: '1403/02/10',
        description: 'موافقت با برگشت بخشی از کالای فروخته شده به بازرگانی سینا',
        type: 'regular',
        items: [
          { id: 'item-7-1', accountCode: '403', accountName: 'برگشت از فروش و تخفیفات (کاهنده درآمد)', debit: 4000000, credit: 0, description: 'برگشت کالای نامنطبق مشتری' },
          { id: 'item-7-2', accountCode: '103', accountName: 'حساب‌های دریافتنی تجاری', debit: 0, credit: 4000000, description: 'کاهش طلب از سینا' }
        ],
        createdAt: '1403/02/10'
      },
      {
        id: 'entry-8',
        entryNumber: 8,
        date: '1403/02/25',
        description: 'پرداخت حقوق و دستمزد پرسنل و اجاره دفتر',
        type: 'regular',
        items: [
          { id: 'item-8-1', accountCode: '601', accountName: 'هزینه حقوق و دستمزد', debit: 12000000, credit: 0, description: 'حقوق اردیبهشت ماه' },
          { id: 'item-8-2', accountCode: '602', accountName: 'هزینه اجاره محل', debit: 8000000, credit: 0, description: 'اجاره محل شرکت' },
          { id: 'item-8-3', accountCode: '102', accountName: 'حساب‌های بانکی', debit: 0, credit: 20000000, description: 'پرداخت از حساب بانکی' }
        ],
        createdAt: '1403/02/25'
      },
      {
        id: 'entry-9',
        entryNumber: 9,
        date: '1403/12/29',
        description: 'ثبت اصلاحی پایان دوره: ملزومات مصرف شده طی سال بر اساس انبارگردانی',
        type: 'adjusting',
        items: [
          { id: 'item-9-1', accountCode: '604', accountName: 'هزینه ملزومات مصرف شده', debit: 4500000, credit: 0, description: 'شناسایی هزینه ملزومات مصرفی' },
          { id: 'item-9-2', accountCode: '106', accountName: 'ملزومات اداری و مصرفی', debit: 0, credit: 4500000, description: 'کاهش مانده ملزومات اداری' }
        ],
        createdAt: '1403/12/29'
      },
      {
        id: 'entry-10',
        entryNumber: 10,
        date: '1403/12/29',
        description: 'ثبت اصلاحی پایان دوره: شناسایی هزینه استهلاک اثاثه اداری سال جاری',
        type: 'adjusting',
        items: [
          { id: 'item-10-1', accountCode: '603', accountName: 'هزینه استهلاک دارایی‌های ثابت', debit: 3000000, credit: 0, description: 'استهلاک اثاثه بر اساس روش خط مستقیم' },
          { id: 'item-10-2', accountCode: '125', accountName: 'استهلاک انباشته اثاثه (کاهنده دارایی)', debit: 0, credit: 3000000, description: 'افزایش استهلاک انباشته اثاثه' }
        ],
        createdAt: '1403/12/29'
      }
    ],
    invoices: [
      {
        id: 'inv-1',
        invoiceNumber: 'خ-۱۰۱',
        type: 'purchase',
        date: '1403/01/15',
        partyName: 'شرکت تأمین کالای البرز',
        items: [
          { id: 'inv-i-1', description: 'کالای الف (مدل پیشرفته)', quantity: 30, unitPrice: 1000000, totalPrice: 30000000 },
          { id: 'inv-i-2', description: 'کالای ب (مدل استاندارد)', quantity: 15, unitPrice: 1000000, totalPrice: 15000000 }
        ],
        subtotal: 45000000,
        discount: 0,
        tax: 0,
        total: 45000000,
        paymentType: 'credit',
        cashAmount: 0,
        creditAmount: 45000000,
        linkedJournalEntryId: 'entry-3',
        note: 'مهلت پرداخت ۶۰ روزه'
      },
      {
        id: 'inv-2',
        invoiceNumber: 'ف-۲۰۱',
        type: 'sale',
        date: '1403/02/05',
        partyName: 'بازرگانی سینا',
        items: [
          { id: 'inv-i-3', description: 'کالای الف (فروش)', quantity: 20, unitPrice: 2000000, totalPrice: 40000000 },
          { id: 'inv-i-4', description: 'کالای ب (فروش)', quantity: 15, unitPrice: 2000000, totalPrice: 30000000 }
        ],
        subtotal: 70000000,
        discount: 0,
        tax: 0,
        total: 70000000,
        paymentType: 'mixed',
        cashAmount: 35000000,
        creditAmount: 35000000,
        linkedJournalEntryId: 'entry-6',
        note: 'نیمی نقد و نیمی نسیه ۳۰ روزه'
      }
    ]
  },
  {
    project: {
      id: 'proj-service-02',
      name: 'شرکت مهندسی و خدماتی سپهر (پروژه کلاسی)',
      type: 'service',
      inventoryMethod: 'perpetual',
      fiscalYear: '۱۴۰۳',
      currency: 'toman',
      description: 'پروژه آموزشی حسابداری شرکت خدماتی - شامل درآمد خدمات، پیش‌دریافت، ثبت‌های اصلاحی استهلاک و حقوق',
      studentName: 'دانشجوی حسابداری',
      courseName: 'حسابداری مقدماتی و مالی ۱',
      createdAt: '1403/01/01',
      updatedAt: '1403/12/29'
    },
    entries: [
      {
        id: 'serv-entry-1',
        entryNumber: 1,
        date: '1403/01/01',
        description: 'تأسیس شرکت خدماتی با آورده نقد به بانک و یک دستگاه خودرو',
        type: 'opening',
        items: [
          { id: 'se-1-1', accountCode: '102', accountName: 'حساب‌های بانکی', debit: 80000000, credit: 0, description: 'آورده نقدی به حساب بانک' },
          { id: 'se-1-2', accountCode: '126', accountName: 'وسایط نقلیه', debit: 120000000, credit: 0, description: 'آوردن خودرو جهت خدمات' },
          { id: 'se-1-3', accountCode: '301', accountName: 'سرمایه اولیه', debit: 0, credit: 200000000, description: 'ثبت سرمایه اولیه موسسان' }
        ],
        createdAt: '1403/01/01'
      },
      {
        id: 'serv-entry-2',
        entryNumber: 2,
        date: '1403/01/10',
        description: 'ارائه خدمات مهندسی و طراحی نقشه به کارفرمایان و دریافت چک',
        type: 'regular',
        items: [
          { id: 'se-2-1', accountCode: '104', accountName: 'اسناد دریافتنی تجاری (چک‌ها)', debit: 45000000, credit: 0, description: 'دریافت چک سررسید یک‌ماهه' },
          { id: 'se-2-2', accountCode: '401', accountName: 'درآمد ارائه خدمات', debit: 0, credit: 45000000, description: 'شناسایی درآمد ارائه خدمات' }
        ],
        createdAt: '1403/01/10'
      },
      {
        id: 'serv-entry-3',
        entryNumber: 3,
        date: '1403/02/01',
        description: 'دریافت نقد از مشتری بابت پیش‌دریافت خدمات مهندسی دو ماه آینده',
        type: 'regular',
        items: [
          { id: 'se-3-1', accountCode: '102', accountName: 'حساب‌های بانکی', debit: 20000000, credit: 0, description: 'واریز نقد به حساب بانکی' },
          { id: 'se-3-2', accountCode: '203', accountName: 'پیش‌دریافت‌ها (پیش‌دریافت درآمد)', debit: 0, credit: 20000000, description: 'پیش‌دریافت تعهد ارائه خدمات' }
        ],
        createdAt: '1403/02/01'
      },
      {
        id: 'serv-entry-4',
        entryNumber: 4,
        date: '1403/12/29',
        description: 'ثبت اصلاحی پایان دوره: تحقق نیمی از درآمد پیش‌دریافت شده',
        type: 'adjusting',
        items: [
          { id: 'se-4-1', accountCode: '203', accountName: 'پیش‌دریافت‌ها (پیش‌دریافت درآمد)', debit: 10000000, credit: 0, description: 'کاهش بدهی پیش‌دریافت' },
          { id: 'se-4-2', accountCode: '401', accountName: 'درآمد ارائه خدمات', debit: 0, credit: 10000000, description: 'شناسایی درآمد تحقق یافته' }
        ],
        createdAt: '1403/12/29'
      },
      {
        id: 'serv-entry-5',
        entryNumber: 5,
        date: '1403/12/29',
        description: 'ثبت اصلاحی استهلاک خودرو سال مالی جاری',
        type: 'adjusting',
        items: [
          { id: 'se-5-1', accountCode: '603', accountName: 'هزینه استهلاک دارایی‌های ثابت', debit: 12000000, credit: 0, description: 'استهلاک ۱۰٪ خودرو' },
          { id: 'se-5-2', accountCode: '127', accountName: 'استهلاک انباشته وسایط نقلیه (کاهنده دارایی)', debit: 0, credit: 12000000, description: 'استهلاک انباشته خودرو' }
        ],
        createdAt: '1403/12/29'
      }
    ],
    invoices: []
  }
];
