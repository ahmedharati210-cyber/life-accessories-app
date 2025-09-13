# لايف أكسسوارز - Life Accessories

متجر إكسسوارات عربي أنيق ومتطور مبني بـ Next.js 15 مع دعم كامل للغة العربية ودفع عند الاستلام.

## 🌟 المميزات

- **تصميم عربي RTL**: واجهة مستخدم محسنة للغة العربية مع دعم كامل للنص من اليمين لليسار
- **متجر إكسسوارات متكامل**: تصفح المنتجات، إضافة للحقيبة، وإتمام الطلب
- **دفع عند الاستلام**: لا حاجة لبطاقات ائتمان أو حسابات بنكية
- **توصيل محلي**: دعم مناطق ليبيا المختلفة مع حساب رسوم التوصيل
- **تصميم متجاوب**: يعمل بشكل مثالي على جميع الأجهزة
- **أداء عالي**: محسن للسرعة مع Next.js 15 و Vercel
- **تخزين سحابي**: استخدام Vercel KV لتخزين الطلبات

## 🛠️ التقنيات المستخدمة

- **Frontend**: Next.js 15 (App Router), TypeScript, Tailwind CSS
- **UI Components**: Lucide React (أيقونات), Framer Motion (حركات)
- **Storage**: MongoDB (تخزين الطلبات)
- **Analytics**: Vercel Analytics & Speed Insights
- **Deployment**: Vercel

## 🚀 البدء السريع

### المتطلبات

- Node.js 18+ 
- npm أو pnpm أو yarn

### التثبيت

1. **استنساخ المشروع**
```bash
git clone <repository-url>
cd life-accessories
```

2. **تثبيت التبعيات**
```bash
npm install
# أو
pnpm install
# أو
yarn install
```

3. **تشغيل المشروع محلياً**
```bash
npm run dev
# أو
pnpm dev
# أو
yarn dev
```

4. **فتح المتصفح**
افتح [http://localhost:3000](http://localhost:3000) في متصفحك

## 📁 هيكل المشروع

```
src/
├── app/                    # Next.js App Router
│   ├── (shop)/            # مجموعة صفحات المتجر
│   │   ├── category/      # صفحات الفئات
│   │   └── product/       # صفحات المنتجات
│   ├── api/               # API Routes
│   │   └── order/         # API الطلبات
│   ├── bag/               # صفحة الحقيبة
│   ├── checkout/          # صفحة إتمام الطلب
│   ├── success/           # صفحة نجاح الطلب
│   ├── layout.tsx         # التخطيط الرئيسي
│   └── page.tsx           # الصفحة الرئيسية
├── components/            # المكونات
│   ├── ui/               # مكونات واجهة المستخدم الأساسية
│   └── features/         # مكونات الميزات
├── data/                 # ملفات البيانات
│   ├── products.json     # بيانات المنتجات
│   ├── categories.json   # بيانات الفئات
│   └── areas.json        # بيانات المناطق
├── hooks/                # React Hooks
├── lib/                  # مكتبات مساعدة
└── types.ts              # تعريفات TypeScript
```

## 🔧 الإعدادات

### متغيرات البيئة

أنشئ ملف `.env.local` في الجذر:

```env
# Vercel KV (مطلوب للإنتاج)
KV_REST_API_URL=your_kv_url
KV_REST_API_TOKEN=your_kv_token

# اختياري: إشعارات البريد الإلكتروني
RESEND_API_KEY=your_resend_key
ORDERS_NOTIFICATION_TO=admin@example.com
```

### إعداد Vercel KV

1. اذهب إلى [Vercel Dashboard](https://vercel.com/dashboard)
2. اختر مشروعك
3. اذهب إلى Storage → Create Database → KV
4. انسخ `KV_REST_API_URL` و `KV_REST_API_TOKEN`
5. أضفها إلى متغيرات البيئة

## 📱 الصفحات والميزات

### الصفحة الرئيسية
- قسم البطل مع دعوة للعمل
- عرض المنتجات المميزة
- فئات المنتجات
- ميزات المتجر

### صفحات المنتجات
- عرض تفصيلي للمنتج
- معرض صور
- إضافة للحقيبة
- منتجات مشابهة

### الحقيبة والطلبات
- إدارة الحقيبة
- تعديل الكميات
- حساب المجموع
- إتمام الطلب

### نظام الطلبات
- نموذج طلب شامل
- اختيار المنطقة
- حساب رسوم التوصيل
- حفظ في Vercel KV

## 🎨 التخصيص

### الألوان والتصميم
يمكنك تخصيص الألوان في `tailwind.config.ts`:

```typescript
theme: {
  extend: {
    colors: {
      primary: {
        DEFAULT: 'hsl(var(--primary))',
        foreground: 'hsl(var(--primary-foreground))',
      },
      // ... ألوان أخرى
    }
  }
}
```

### إضافة منتجات جديدة
أضف منتجات جديدة في `src/data/products.json`:

```json
{
  "id": "product-id",
  "name": "اسم المنتج",
  "nameEn": "Product Name",
  "slug": "product-slug",
  "description": "وصف المنتج",
  "price": 100.0,
  "category": "category-id",
  "images": ["/images/product.jpg"],
  "thumbnail": "/images/product-thumb.jpg",
  "inStock": true,
  "stock": 10,
  "isNew": false,
  "isFeatured": true,
  "isOnSale": false
}
```

### إضافة مناطق جديدة
أضف مناطق جديدة في `src/data/areas.json`:

```json
{
  "id": "area-id",
  "name": "اسم المنطقة",
  "nameEn": "Area Name",
  "deliveryFee": 15,
  "deliveryTime": "45-60 دقيقة",
  "isAvailable": true
}
```

## 🚀 النشر على Vercel

### النشر التلقائي
1. اربط مستودع GitHub مع Vercel
2. أضف متغيرات البيئة في Vercel Dashboard
3. انشر تلقائياً مع كل push

### النشر اليدوي
```bash
# تثبيت Vercel CLI
npm i -g vercel

# تسجيل الدخول
vercel login

# النشر
vercel

# النشر للإنتاج
vercel --prod
```

## 📊 المراقبة والتحليلات

- **Vercel Analytics**: تتبع الزوار والتفاعل
- **Speed Insights**: مراقبة الأداء
- **Vercel KV**: تخزين الطلبات والبيانات

## 🔒 الأمان

- التحقق من صحة البيانات في API
- تشفير البيانات الحساسة
- حماية من CSRF
- تنظيف المدخلات

## 🐛 استكشاف الأخطاء

### مشاكل شائعة

1. **خطأ في Vercel KV**
   - تأكد من صحة متغيرات البيئة
   - تحقق من صلاحيات Vercel KV

2. **مشاكل في الخطوط العربية**
   - تأكد من تحميل خط Cairo
   - تحقق من إعدادات RTL

3. **مشاكل في الصور**
   - تأكد من وجود الصور في مجلد `public`
   - تحقق من مسارات الصور

## 🤝 المساهمة

1. Fork المشروع
2. أنشئ فرع للميزة الجديدة (`git checkout -b feature/amazing-feature`)
3. Commit التغييرات (`git commit -m 'Add amazing feature'`)
4. Push للفرع (`git push origin feature/amazing-feature`)
5. افتح Pull Request

## 📄 الترخيص

هذا المشروع مرخص تحت رخصة MIT - انظر ملف [LICENSE](LICENSE) للتفاصيل.

## 📞 الدعم

للحصول على الدعم أو الإبلاغ عن مشاكل:
- افتح issue في GitHub
- تواصل معنا عبر البريد الإلكتروني

## 🙏 شكر وتقدير

- [Next.js](https://nextjs.org/) - إطار العمل
- [Tailwind CSS](https://tailwindcss.com/) - التصميم
- [Lucide React](https://lucide.dev/) - الأيقونات
- [Framer Motion](https://www.framer.com/motion/) - الحركات
- [Vercel](https://vercel.com/) - الاستضافة والتخزين

---

**ملاحظة**: هذا المشروع مصمم خصيصاً للسوق الليبي مع دعم كامل للغة العربية ودفع عند الاستلام.