import { type FormEvent, useEffect, useMemo, useState } from 'react';
import {
  ArrowRight,
  ArrowUpRight,
  Facebook,
  Instagram,
  Mail,
  Menu,
  Search,
  X,
} from 'lucide-react';
import './index.css';

type Language = 'en' | 'ar';

type Article = {
  id: string;
  title: string;
  category: string;
  readTime: string;
  description: string;
  date?: string;
  image: string;
};

const asset = (filename: string) => `${import.meta.env.BASE_URL}images/${filename}`;

const copy = {
  en: {
    nav: { home: 'Home', makeup: 'Makeup', skincare: 'Skincare', tips: 'Beauty Tips', about: 'About' },
    heroKicker: 'Beauty Journal',
    heroTitle: 'Your Guide to Effortless Beauty',
    heroDescription: 'Discover expert makeup tutorials, skincare routines, and beauty tips curated for every skin type.',
    exploreTips: 'Explore Tips',
    editorsPicks: "Editor's Picks",
    featuredArticles: 'Featured Articles',
    viewAll: 'View All',
    readMore: 'Read More',
    explore: 'Explore',
    browseCategory: 'Browse by Category',
    latestKicker: 'Fresh from the Journal',
    latestTitle: 'Latest Beauty Tips',
    allArticles: 'All Articles',
    categories: {
      makeup: { title: 'Makeup', subtitle: 'Tutorials, tips & product guides' },
      skincare: { title: 'Skincare', subtitle: 'Routines, ingredients & skin wisdom' },
      beautyTips: { title: 'Beauty Tips', subtitle: 'Quick tips & beauty secrets' },
    },
    quote: 'Less is more — start with a small amount of foundation and build coverage only where you truly need it.',
    quoteAttribution: 'The foundation of beautiful makeup is restraint.',
    newsletterTitle: 'Beauty tips, delivered with love.',
    newsletterDescription: 'Join our community of beauty lovers. Get weekly articles, skincare guides, and exclusive makeup tips — straight to your inbox.',
    emailPlaceholder: 'Your email address',
    subscribe: 'Subscribe',
    subscribed: 'You are on the list. See you in your inbox.',
    searchPlaceholder: 'Search the journal',
    noResults: 'No stories found yet.',
    footerDescription: 'Discover elegant makeup and skincare tips through beautifully designed articles, perfect for beauty enthusiasts seeking modern, feminine inspiration.',
    footer: { explore: 'Explore', about: 'About', follow: 'Follow along', ourStory: 'Our Story', contact: 'Contact', editorial: 'Editorial standards' },
    crafted: 'A little beauty, thoughtfully made.',
    copyright: '© 2026 Lumière Beauty Journal. All rights reserved.',
    close: 'Close',
  },
  ar: {
    nav: { home: 'الرئيسية', makeup: 'المكياج', skincare: 'العناية بالبشرة', tips: 'نصائح الجمال', about: 'عن المجلة' },
    heroKicker: 'مجلة الجمال',
    heroTitle: 'دليلك لجمال بلا تكلّف',
    heroDescription: 'اكتشفي دروس مكياج احترافية، وروتينات للعناية بالبشرة، ونصائح جمال مختارة لكل أنواع البشرة.',
    exploreTips: 'اكتشفي النصائح',
    editorsPicks: 'اختيارات المحررة',
    featuredArticles: 'مقالات مميزة',
    viewAll: 'عرض الكل',
    readMore: 'اقرئي المزيد',
    explore: 'اكتشفي',
    browseCategory: 'تصفحي حسب الفئة',
    latestKicker: 'جديد المجلة',
    latestTitle: 'أحدث نصائح الجمال',
    allArticles: 'كل المقالات',
    categories: {
      makeup: { title: 'المكياج', subtitle: 'دروس ونصائح ودليل المنتجات' },
      skincare: { title: 'العناية بالبشرة', subtitle: 'روتينات ومكونات وحكمة البشرة' },
      beautyTips: { title: 'نصائح الجمال', subtitle: 'نصائح سريعة وأسرار الجمال' },
    },
    quote: 'الأقل هو الأكثر — ابدئي بكمية صغيرة من كريم الأساس وزيدي التغطية فقط حيث تحتاجينها حقاً.',
    quoteAttribution: 'أساس المكياج الجميل هو الاعتدال.',
    newsletterTitle: 'نصائح جمال تصلكِ بكل حب.',
    newsletterDescription: 'انضمي إلى مجتمع محبات الجمال. مقالات أسبوعية، وأدلة للعناية بالبشرة، ونصائح مكياج حصرية — مباشرة إلى بريدكِ.',
    emailPlaceholder: 'بريدكِ الإلكتروني',
    subscribe: 'اشتراك',
    subscribed: 'تم تسجيلكِ. نراكِ في بريدكِ قريباً.',
    searchPlaceholder: 'ابحثي في المجلة',
    noResults: 'لم نعثر على قصص بعد.',
    footerDescription: 'اكتشفي نصائح أنيقة للمكياج والعناية بالبشرة في مقالات مصممة بعناية، لمحبات الجمال الباحثات عن إلهام عصري وأنثوي.',
    footer: { explore: 'اكتشفي', about: 'عن المجلة', follow: 'تابعينا', ourStory: 'قصتنا', contact: 'تواصلي معنا', editorial: 'معايير التحرير' },
    crafted: 'قليل من الجمال، بصناعة متأنية.',
    copyright: '© 2026 Lumière Beauty Journal. جميع الحقوق محفوظة.',
    close: 'إغلاق',
  },
} as const;

const featuredArticle: Article = {
  id: 'beginner-makeup',
  title: '5 Makeup Tricks Every Beginner Should Know',
  category: 'Makeup',
  readTime: '5 min read',
  description: 'Starting your makeup journey can feel overwhelming, but these five essential tricks will give you confidence and beautiful results from day one.',
  image: 'featured.jpg',
};

const compactArticles: Article[] = [
  { id: 'skincare-routine', title: 'How to Build the Perfect Skincare Routine', category: 'Skincare', readTime: '7 min read', description: 'A simple, thoughtful routine is the first step toward healthy, comfortable skin.', image: 'routine.jpg' },
  { id: 'effortless-makeup', title: 'Everyday Makeup That Looks Effortless', category: 'Makeup', readTime: '4 min read', description: 'The little techniques that make getting ready feel beautifully easy.', image: 'everyday.jpg' },
  { id: 'skincare-mistakes', title: 'Skincare Mistakes You Should Stop Making', category: 'Skincare', readTime: '6 min read', description: 'A few common habits may be getting in the way of your best skin.', image: 'mistakes.jpg' },
];

const latestArticles: Article[] = [
  { id: 'foundation', title: 'The Right Way to Apply Foundation', category: 'Makeup', readTime: '5 min read', description: 'Foundation application is an art form. Learn the tools, techniques, and tips that separate a cakey finish from a flawless complexion.', date: 'August 10, 2026', image: 'foundation.jpg' },
  { id: 'ingredients', title: 'Skincare Ingredients You Need in Your 20s', category: 'Skincare', readTime: '6 min read', description: 'Your 20s are the ideal time to invest in preventative skincare. These powerhouse ingredients will keep your skin healthy for decades.', date: 'August 8, 2026', image: 'ingredients.jpg' },
  { id: 'eye-makeup', title: 'Eye Makeup for Beginners', category: 'Makeup', readTime: '5 min read', description: 'Eye makeup can feel intimidating, but with the right techniques and tools, anyone can create beautiful eye looks at home.', date: 'August 5, 2026', image: 'eye.jpg' },
  { id: 'moisturizer', title: 'How to Choose the Right Moisturizer', category: 'Skincare', readTime: '4 min read', description: 'Not all moisturizers are created equal. Discover how to read ingredient labels and choose the one that truly matches your skin type.', date: 'August 3, 2026', image: 'moisturizer.jpg' },
  { id: 'everyday-lip', title: 'Natural Everyday Lip Look', category: 'Beauty Tips', readTime: '3 min read', description: 'The perfect everyday lip look enhances your natural beauty without overpowering your features. Here are our favourite effortless lip formulas.', date: 'August 1, 2026', image: 'lip.jpg' },
  { id: 'blush', title: 'Blush Placement for Your Face Shape', category: 'Makeup', readTime: '5 min read', description: 'The placement of blush can completely transform your face. Learn how to apply it strategically based on your unique bone structure.', date: 'July 28, 2026', image: 'hero.jpg' },
];

const arabicArticleTitles: Record<string, string> = {
  'beginner-makeup': '5 حيل مكياج يجب أن تعرفها كل مبتدئة',
  'skincare-routine': 'كيف تبنين روتين العناية المثالي بالبشرة',
  'effortless-makeup': 'مكياج يومي يبدو بلا مجهود',
  'skincare-mistakes': 'أخطاء في العناية بالبشرة عليكِ التوقف عنها',
  foundation: 'الطريقة الصحيحة لتطبيق كريم الأساس',
  ingredients: 'مكونات العناية بالبشرة التي تحتاجينها في العشرينات',
  'eye-makeup': 'مكياج العيون للمبتدئات',
  moisturizer: 'كيف تختارين المرطب المناسب',
  'everyday-lip': 'إطلالة شفاه طبيعية لكل يوم',
  blush: 'توزيع أحمر الخدود حسب شكل وجهك',
};

const arabicCategories: Record<string, string> = { Makeup: 'المكياج', Skincare: 'العناية بالبشرة', 'Beauty Tips': 'نصائح الجمال' };
const arabicDescriptions: Record<string, string> = {
  'beginner-makeup': 'قد تبدو بداية رحلتكِ مع المكياج مربكة، لكن هذه الحيل الخمس الأساسية ستمنحكِ الثقة ونتائج جميلة منذ اليوم الأول.',
  'skincare-routine': 'روتين بسيط ومدروس هو الخطوة الأولى نحو بشرة صحية ومريحة.',
  'effortless-makeup': 'تقنيات صغيرة تجعل استعدادكِ للخروج أسهل وأجمل كل يوم.',
  'skincare-mistakes': 'قد تقف بعض العادات الشائعة في طريق وصول بشرتكِ إلى أفضل حالاتها.',
  foundation: 'تطبيق كريم الأساس فن بحد ذاته. تعلّمي الأدوات والتقنيات والنصائح التي تفرق بين مظهر متكتل وبشرة صافية.',
  ingredients: 'العشرينات هي الوقت المثالي للاستثمار في العناية الوقائية بالبشرة. هذه المكونات القوية ستحافظ على صحة بشرتكِ لسنوات.',
  'eye-makeup': 'قد يبدو مكياج العيون مخيفاً، لكن مع التقنيات والأدوات المناسبة يمكن لأي امرأة ابتكار إطلالات جميلة في المنزل.',
  moisturizer: 'ليست كل المرطبات متشابهة. اكتشفي كيف تقرئين قائمة المكونات وتختارين ما يناسب نوع بشرتكِ حقاً.',
  'everyday-lip': 'إطلالة الشفاه اليومية المثالية تعزز جمالكِ الطبيعي من دون أن تطغى على ملامحكِ. إليكِ تركيبات سهلة وأنيقة.',
  blush: 'يمكن لطريقة توزيع أحمر الخدود أن تغيّر ملامح وجهكِ تماماً. تعلّمي تطبيقه وفقاً لبنية وجهكِ الفريدة.',
};
const arabicDates: Record<string, string> = {
  foundation: '10 أغسطس 2026',
  ingredients: '8 أغسطس 2026',
  'eye-makeup': '5 أغسطس 2026',
  moisturizer: '3 أغسطس 2026',
  'everyday-lip': '1 أغسطس 2026',
  blush: '28 يوليو 2026',
};

function localizedArticle(article: Article, language: Language): Article {
  if (language === 'en') return article;
  return {
    ...article,
    title: arabicArticleTitles[article.id] || article.title,
    category: arabicCategories[article.category] || article.category,
    readTime: article.readTime.replace(' min read', ' دقائق قراءة'),
    description: arabicDescriptions[article.id] || article.description,
    date: article.date ? arabicDates[article.id] : undefined,
  };
}

function ArrowLink({ children, onClick, testId }: { children: string; onClick?: () => void; testId: string }) {
  return (
    <a href="#latest" className="text-link" onClick={onClick} data-testid={testId}>
      {children}<ArrowRight size={14} strokeWidth={1.5} />
    </a>
  );
}

function ArticleMeta({ article }: { article: Article }) {
  return <div className="meta"><span>{article.category}</span><span>{article.readTime}</span></div>;
}

function ArticleModal({ article, language, onClose }: { article: Article; language: Language; onClose: () => void }) {
  const text = copy[language];
  return (
    <div className="modal-backdrop" role="presentation" onClick={onClose}>
      <article className="article-modal" role="dialog" aria-modal="true" onClick={(event) => event.stopPropagation()} data-testid={`modal-article-${article.id}`}>
        <button className="close-modal" onClick={onClose} aria-label={text.close} data-testid="button-close-article"><X size={17} /></button>
        <div className="article-modal-image"><img src={asset(article.image)} alt={article.title} /></div>
        <div className="article-modal-content">
          <ArticleMeta article={article} />
          <h2>{article.title}</h2>
          <p>{article.description}</p>
          {article.date && <span className="date">{article.date}</span>}
          <button className="button-rose" onClick={onClose} data-testid="button-close-reading">{text.close}<ArrowRight size={14} /></button>
        </div>
      </article>
    </div>
  );
}

function App() {
  const [language, setLanguage] = useState<Language>(() => {
    const stored = window.localStorage.getItem('lumiere-language');
    return stored === 'ar' ? 'ar' : 'en';
  });
  const [mobileMenu, setMobileMenu] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
  const [subscribed, setSubscribed] = useState(false);
  const [email, setEmail] = useState('');
  const text = copy[language];

  useEffect(() => {
    document.documentElement.lang = language;
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
    window.localStorage.setItem('lumiere-language', language);
  }, [language]);

  const allArticles = useMemo(() => [featuredArticle, ...compactArticles, ...latestArticles], []);
  const searchResults = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return latestArticles.slice(0, 4);
    return allArticles.filter((article) => article.title.toLowerCase().includes(query) || article.category.toLowerCase().includes(query));
  }, [allArticles, searchQuery]);

  const switchLanguage = (nextLanguage: Language) => {
    setLanguage(nextLanguage);
    setMobileMenu(false);
  };
  const closeMenus = () => setMobileMenu(false);
  const openArticle = (article: Article) => setSelectedArticle(localizedArticle(article, language));
  const scrollToLatest = () => {
    document.getElementById('latest')?.scrollIntoView({ behavior: 'smooth' });
    setMobileMenu(false);
  };
  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (email.trim()) setSubscribed(true);
  };

  return (
    <div className="site-shell">
      <header className="site-header" data-testid="header-site">
        <div className="header-inner">
          <a href="#home" className="wordmark" onClick={closeMenus} data-testid="link-wordmark">Lumière</a>
          <nav className={`main-nav ${mobileMenu ? 'open' : ''}`} aria-label="Main navigation">
            <a href="#home" onClick={closeMenus} className="active" data-testid="link-home">{text.nav.home}</a>
            <a href="#categories" onClick={closeMenus} data-testid="link-makeup">{text.nav.makeup}</a>
            <a href="#categories" onClick={closeMenus} data-testid="link-skincare">{text.nav.skincare}</a>
            <a href="#latest" onClick={closeMenus} data-testid="link-beauty-tips">{text.nav.tips}</a>
            <a href="#about" onClick={closeMenus} data-testid="link-about">{text.nav.about}</a>
          </nav>
          <div className="header-actions">
            <button className="lang-toggle" onClick={() => switchLanguage(language === 'en' ? 'ar' : 'en')} aria-label={language === 'en' ? 'العربية' : 'English'} data-testid="button-language-toggle">
              <span className={language === 'en' ? 'active-lang' : ''}>EN</span><span className="lang-divider">/</span><span className={language === 'ar' ? 'active-lang' : ''}>العربية</span>
            </button>
            <button className="search-button" onClick={() => setSearchOpen((open) => !open)} aria-label="Search" data-testid="button-open-search">
              <Search size={16} strokeWidth={1.5} />
            </button>
            <button className="menu-button" onClick={() => setMobileMenu((open) => !open)} aria-label="Menu" data-testid="button-mobile-menu">
              {mobileMenu ? <X size={20} strokeWidth={1.5} /> : <Menu size={20} strokeWidth={1.5} />}
            </button>
          </div>
        </div>
      </header>

      {searchOpen && (
        <div className="search-drawer" data-testid="search-drawer">
          <div className="search-inner">
            <div className="search-input-wrap">
              <Search size={19} strokeWidth={1.5} />
              <input autoFocus type="search" value={searchQuery} onChange={(event) => setSearchQuery(event.target.value)} placeholder={text.searchPlaceholder} aria-label={text.searchPlaceholder} data-testid="input-search" />
              <button className="search-button" onClick={() => setSearchOpen(false)} aria-label={text.close} data-testid="button-close-search"><X size={17} /></button>
            </div>
            <div className="search-results">
              {searchResults.length ? searchResults.map((article) => (
                <a href="#latest" key={article.id} onClick={(event) => { event.preventDefault(); setSearchOpen(false); openArticle(article); }} data-testid={`result-search-${article.id}`}>
                  {language === 'ar' ? arabicArticleTitles[article.id] : article.title}<ArrowUpRight size={11} style={{ display: 'inline', marginInlineStart: 5 }} />
                </a>
              )) : <span>{text.noResults}</span>}
            </div>
          </div>
        </div>
      )}

      <main>
        <section className="hero" id="home" data-testid="section-hero">
          <img className="hero-image" src={asset('hero.jpg')} alt="Editorial beauty portrait" />
          <div className="hero-content">
            <span className="eyebrow">{text.heroKicker}</span>
            <h1>{text.heroTitle}</h1>
            <p className="hero-copy">{text.heroDescription}</p>
            <button className="button-rose" onClick={scrollToLatest} data-testid="button-explore-tips">{text.exploreTips}<ArrowRight size={14} /></button>
          </div>
          <div className="hero-circles" aria-hidden="true" />
        </section>

        <section className="section picks" id="picks" data-testid="section-picks">
          <div className="section-inner">
            <div className="section-kicker">{text.editorsPicks}</div>
            <div className="section-heading-row">
              <h2>{text.featuredArticles}</h2>
              <ArrowLink children={text.viewAll} onClick={scrollToLatest} testId="link-view-all" />
            </div>
            <div className="picks-layout">
              <article className="featured-card" onClick={() => openArticle(featuredArticle)} data-testid="card-featured-article">
                <div className="featured-image-wrap"><img src={asset(featuredArticle.image)} alt={featuredArticle.title} /></div>
                <div className="featured-body">
                  <ArticleMeta article={localizedArticle(featuredArticle, language)} />
                  <h3>{localizedArticle(featuredArticle, language).title}</h3>
                  <p>{localizedArticle(featuredArticle, language).description}</p>
                  <ArrowLink children={text.readMore} onClick={() => openArticle(featuredArticle)} testId="link-read-featured" />
                </div>
              </article>
              <div className="compact-list">
                {compactArticles.map((article) => {
                  const localized = localizedArticle(article, language);
                  return (
                    <article className="compact-card" key={article.id} onClick={() => openArticle(article)} data-testid={`card-compact-${article.id}`}>
                      <img src={asset(article.image)} alt={localized.title} />
                      <div className="compact-body"><ArticleMeta article={localized} /><h4>{localized.title}</h4><ArrowLink children={text.readMore} onClick={() => openArticle(article)} testId={`link-read-${article.id}`} /></div>
                    </article>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        <section className="section category-section" id="categories" data-testid="section-categories">
          <div className="section-inner">
            <div className="section-kicker">{text.explore}</div>
            <div className="section-heading-row"><h2>{text.browseCategory}</h2></div>
            <div className="category-grid">
              {([
                { key: 'makeup', image: 'makeup.jpg' },
                { key: 'skincare', image: 'skincare.jpg' },
                { key: 'beautyTips', image: 'tips.jpg' },
              ] as const).map((category) => (
                <a className="category-card" href="#latest" key={category.key} onClick={scrollToLatest} data-testid={`card-category-${category.key}`}>
                  <img src={asset(category.image)} alt={text.categories[category.key].title} />
                  <div className="category-content"><h3>{text.categories[category.key].title}</h3><p>{text.categories[category.key].subtitle}</p><span className="text-link">{text.explore}<ArrowRight size={14} /></span></div>
                </a>
              ))}
            </div>
          </div>
        </section>

        <section className="section latest" id="latest" data-testid="section-latest">
          <div className="section-inner">
            <div className="section-kicker">{text.latestKicker}</div>
            <div className="section-heading-row"><h2>{text.latestTitle}</h2><ArrowLink children={text.allArticles} onClick={() => undefined} testId="link-all-articles" /></div>
            <div className="article-grid">
              {latestArticles.map((article) => {
                const localized = localizedArticle(article, language);
                return (
                  <article className="article-card" key={article.id} onClick={() => openArticle(article)} data-testid={`card-latest-${article.id}`}>
                    <div className="article-image"><img src={asset(article.image)} alt={localized.title} /></div>
                    <div className="article-body">
                      <ArticleMeta article={localized} />
                      <h3>{localized.title}</h3>
                      <p>{localized.description}</p>
                      {article.date && <span className="date">{article.date}</span>}
                      <ArrowLink children={text.readMore} onClick={() => openArticle(article)} testId={`link-read-latest-${article.id}`} />
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
        </section>

        <section className="wisdom" data-testid="section-wisdom">
          <div className="wisdom-inner"><span className="quote-mark">“</span><blockquote>{text.quote}</blockquote><cite>{text.quoteAttribution}</cite></div>
        </section>

        <section className="newsletter" id="about" data-testid="section-newsletter">
          <div className="newsletter-inner">
            <div className="section-kicker" style={{ justifyContent: 'center' }}>{text.nav.about}</div>
            <h2>{text.newsletterTitle}</h2>
            <p>{text.newsletterDescription}</p>
            {subscribed ? <div className="success-message" role="status" data-testid="status-newsletter-success">{text.subscribed}</div> : (
              <form className="subscribe-form" onSubmit={handleSubmit}>
                <input type="email" required value={email} onChange={(event) => setEmail(event.target.value)} placeholder={text.emailPlaceholder} aria-label={text.emailPlaceholder} data-testid="input-newsletter-email" />
                <button className="button-rose" type="submit" data-testid="button-newsletter-submit">{text.subscribe}<ArrowRight size={14} /></button>
              </form>
            )}
          </div>
        </section>
      </main>

      <footer className="site-footer" data-testid="footer-site">
        <div className="section-inner">
          <div className="footer-top">
            <div className="footer-brand"><a href="#home" className="wordmark" data-testid="link-footer-wordmark">Lumière</a><p className="footer-description">{text.footerDescription}</p></div>
            <div className="footer-column"><h3>{text.footer.explore}</h3><a href="#home" data-testid="link-footer-home">{text.nav.home}</a><a href="#categories" data-testid="link-footer-makeup">{text.nav.makeup}</a><a href="#categories" data-testid="link-footer-skincare">{text.nav.skincare}</a><a href="#latest" data-testid="link-footer-tips">{text.nav.tips}</a></div>
            <div className="footer-column"><h3>{text.footer.about}</h3><a href="#about" data-testid="link-footer-story">{text.footer.ourStory}</a><a href="mailto:hello@lumierejournal.com" data-testid="link-footer-contact">{text.footer.contact}</a><a href="#about" data-testid="link-footer-editorial">{text.footer.editorial}</a></div>
            <div className="footer-column"><h3>{text.footer.follow}</h3><div className="socials"><a href="https://instagram.com" target="_blank" rel="noreferrer" aria-label="Instagram" data-testid="link-instagram"><Instagram size={17} strokeWidth={1.5} /></a><a href="https://facebook.com" target="_blank" rel="noreferrer" aria-label="Facebook" data-testid="link-facebook"><Facebook size={17} strokeWidth={1.5} /></a><a href="mailto:hello@lumierejournal.com" aria-label="Email" data-testid="link-email"><Mail size={17} strokeWidth={1.5} /></a></div></div>
          </div>
          <div className="footer-bottom"><span>{text.copyright}</span><span>{text.crafted}</span></div>
        </div>
      </footer>

      {selectedArticle && <ArticleModal article={selectedArticle} language={language} onClose={() => setSelectedArticle(null)} />}
    </div>
  );
}

export default App;