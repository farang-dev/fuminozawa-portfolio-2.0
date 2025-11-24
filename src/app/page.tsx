'use client';

import { useEffect, useState } from 'react';
import { BlogPost } from '@/lib/notion';

export default function Home() {
  const [activeTab, setActiveTab] = useState('links');
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);
  const [copyNotification, setCopyNotification] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [showContactForm, setShowContactForm] = useState(false);
  const [language, setLanguage] = useState<'en' | 'ja'>(() => {
    // Detect browser language on initial load
    if (typeof window !== 'undefined') {
      const browserLang = navigator.language || navigator.languages?.[0];
      return browserLang?.startsWith('ja') ? 'ja' : 'en';
    }
    return 'en';
  });
  const [particles, setParticles] = useState<Array<{ id: number, left: number, delay: number }>>([]);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  useEffect(() => {
    // Hide loading overlay after component mounts
    const loadingOverlay = document.querySelector('.loading-overlay') as HTMLElement;
    if (loadingOverlay) {
      setTimeout(() => {
        loadingOverlay.style.opacity = '0';
        loadingOverlay.style.visibility = 'hidden';
      }, 500);
    }

    // Initialize particles
    const particleArray = [];
    for (let i = 0; i < 20; i++) {
      particleArray.push({
        id: i,
        left: Math.random() * 100,
        delay: Math.random() * 6
      });
    }
    setParticles(particleArray);

    // Apply initial theme
    document.body.className = 'light';

    // Detect browser language and set initial language if not already set
    const browserLang = navigator.language || navigator.languages?.[0];
    const detectedLang = browserLang?.startsWith('ja') ? 'ja' : 'en';
    setLanguage(detectedLang);

    // Check URL parameter for tab
    const urlParams = new URLSearchParams(window.location.search);
    const tabParam = urlParams.get('tab');
    if (tabParam && ['links', 'services', 'works', 'writing'].includes(tabParam)) {
      setActiveTab(tabParam);
    }
  }, []);

  useEffect(() => {
    // Update theme when isDarkMode changes
    document.body.className = isDarkMode ? 'dark' : 'light';
  }, [isDarkMode]);

  const handleTabClick = (tabName: string) => {
    setActiveTab(tabName);
    // Update URL parameter
    const url = new URL(window.location.href);
    url.searchParams.set('tab', tabName);
    window.history.pushState({}, '', url.toString());
  };

  const handleEmailCopy = async () => {
    try {
      await navigator.clipboard.writeText('mf.nozawa@gmail.com');
      setCopyNotification(true);
      setTimeout(() => setCopyNotification(false), 2000);
    } catch (err) {
      console.error('Failed to copy email:', err);
    }
  };

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  const handleContactFormToggle = () => {
    setShowContactForm(!showContactForm);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Create mailto link with form data
    const subject = encodeURIComponent(formData.subject || 'お問い合わせ');
    const body = encodeURIComponent(
      `お名前: ${formData.name}\nメールアドレス: ${formData.email}\n\nメッセージ:\n${formData.message}`
    );
    window.open(`mailto:mf.nozawa@gmail.com?subject=${subject}&body=${body}`);
    setIsEmailModalOpen(false);
    setShowContactForm(false);
    setFormData({ name: '', email: '', subject: '', message: '' });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const socialLinks = [
    {
      name: 'LinkedIn',
      url: 'https://www.linkedin.com/in/masafumi-nozawa/',
      color: '#0A66C2',
      icon: 'fab fa-linkedin',
    },
    {
      name: 'Instagram',
      url: 'https://instagram.com/fumi_fumar/',
      color: '#E4405F',
      icon: 'fab fa-instagram',
    },
    {
      name: 'GitHub',
      url: 'https://github.com/farang-dev',
      color: isDarkMode ? '#ffffff' : '#333',
      icon: 'fab fa-github',
    },
    {
      name: 'X (Twitter)',
      url: 'https://x.com/fuminozawa_',
      color: '#1DA1F2',
      icon: 'fab fa-twitter',
    }
  ];

  const speakingEngagements = [
    {
      title: 'Tech Talk: Modern Web Development',
      description: 'Next.js and TypeScript best practices',
    },
    {
      title: 'Open Source Contribution Workshop',
      description: 'Getting started with open source development',
    }
  ];

  const services = [
    {
      id: 'digital-experience',
      title: 'Digital Experience',
      subtitle: '伝わる体験をつくる。Web改修・UX改善・PMとしての実装を一貫して担当。',
      description: 'Webは装飾ではなく「伝わり方」で決まる。私はデータとユーザー理解を起点に、要件定義からUX再設計、実装のPMまで一気通貫で引き受けます。短期間の工数でも優先度を正しく決め、成果に直結する改善を実行します。',
      deliverables: [
        'データ分析とUX分析（行動／理解負荷）',
        '課題抽出・要件定義（Diagnosis）',
        '情報設計・UX/UI改善（Build）',
        'Web改修のPM／実装支援（Build）',
        '改修後の検証と継続改善（Grow）'
      ],
      intent: '見た目よりも使われるかを最優先に。少ない工数で最大の成果を生むための優先順位と実務を提供します。'
    },
    {
      id: 'nextgen-performance',
      title: 'NextGen Performance',
      subtitle: '生成AI時代に適応した、成果が出続けるパフォーマンス設計。GEO／SEO／広告／コンテンツを統合。',
      description: '検索と広告の環境は変わっています。GEO（生成AIを含む検索）を前提に、広告とコンテンツを連動させ、継続して成果を出す運用体制を構築します。施策は検証可能で、内製化できる形に落とします。',
      deliverables: [
        'GEO（生成AI時代の検索）戦略設計',
        'SEO改善と技術的最適化',
        '広告設計・運用（AI活用含む）',
        '生成AIを用いたクリエイティブ制作とテスト運用',
        'KPI設計と回帰改善フロー'
      ],
      intent: '短期の獲得と中長期のオーガニック成長を同時に描ける、再現性のあるパフォーマンス設計を提供します。'
    },
    {
      id: 'japan-market-entry',
      title: 'Japan Market Entry',
      subtitle: 'Helping global brands win in Japan. 深い文化理解とローカルUX／マーケティングの実務で、日本における現地化と勝ち筋を作ります。',
      description: '海外ブランドが直面する課題は、単なる言語翻訳ではありません。消費者の文化的文脈、購買動機、チャネル特性を踏まえた設計と運用が必要です。私はローカライズ戦略の立案からUX調整、デジタルマーケティングの実装まで、現地で結果を出すための実務を提供します。',
      deliverables: [
        '日本市場の需要調査とペルソナ設計',
        'ローカライズ方針（メッセージ／トーン／UX）',
        'サービス／プロダクトの市場適応テスト（A/B）',
        '日本向け広告・流通チャネル設計・運用',
        'ローカルパートナーの選定と協業立ち上げ支援',
        '日本でのユーザーテスト・定性インサイト取得'
      ],
      intent: '海外のやり方をそのまま持ち込むのではなく、日本の実情に合わせて「何を、どう届けるか」を再設計し、短期的なローンチ成功と中長期の拡大を両立します。'
    },
    {
      id: 'ai-operational-design',
      title: 'AI Operational Design',
      subtitle: '生成AIをビジネス・マーケティングのオペレーションに組み込む。再現性のあるワークフロー設計とSOP策定で、属人化を排する。',
      description: '生成AIを「便利なツール」で終わらせず、日々のビジネス・マーケティング業務の中に組み込みます。コンテンツ制作、リサーチ、データ分析、顧客対応など、実務フローに生成AIを統合し、誰でも同じ品質で実行できる仕組み（SOP：標準作業手順書）を設計。現場が自走する状態を作り、運用定着まで伴走します。',
      deliverables: [
        '業務フロー分析とAI活用ポイントの特定',
        '生成AIワークフロー設計（n8n、Zapier等のノーコードツール活用）',
        'SOP（標準作業手順書）策定とテンプレート整備',
        'チーム向けAI活用トレーニングとオンボーディング',
        'ナレッジベース構築と継続改善サイクル設計'
      ],
      intent: '「個人が使う」から「チーム全体で機能する」へ。生成AIを業務の一部として定着させ、生産性と再現性を同時に高めます。'
    }
  ];

  const servicesEn = [
    {
      id: 'digital-experience',
      title: 'Digital Experience',
      subtitle: 'Creating experiences that resonate. End-to-end ownership of web optimization, UX improvement, and implementation as PM.',
      description: 'Web success is determined by how well it communicates, not decoration. Starting from data and user understanding, I handle everything from requirements definition to UX redesign and implementation PM. Even with limited resources, I prioritize correctly and execute improvements that directly impact results.',
      deliverables: [
        'Data analysis and UX analysis (behavior / cognitive load)',
        'Issue extraction and requirements definition (Diagnosis)',
        'Information architecture and UX/UI improvement (Build)',
        'Web optimization PM / implementation support (Build)',
        'Post-implementation verification and continuous improvement (Grow)'
      ],
      intent: 'Usability over aesthetics. Providing prioritization and execution that delivers maximum results with minimal effort.'
    },
    {
      id: 'nextgen-performance',
      title: 'NextGen Performance',
      subtitle: 'Performance design adapted for the generative AI era. Integrating GEO / SEO / advertising / content for sustained results.',
      description: 'The search and advertising landscape has changed. Building on GEO (Generative Engine Optimization), I integrate advertising and content to create operational systems that deliver continuous results. All initiatives are verifiable and structured for in-house execution.',
      deliverables: [
        'GEO (generative AI era search) strategy design',
        'SEO improvement and technical optimization',
        'Advertising design and operations (including AI utilization)',
        'Creative production and test operations using generative AI',
        'KPI design and iterative improvement flow'
      ],
      intent: 'Providing reproducible performance design that balances short-term acquisition with long-term organic growth.'
    },
    {
      id: 'japan-market-entry',
      title: 'Japan Market Entry',
      subtitle: 'Helping global brands win in Japan. Deep cultural understanding and local UX/marketing execution to create localization strategies and winning approaches.',
      description: 'The challenges global brands face aren\'t just language translation. Design and operations must account for consumer cultural context, purchase motivations, and channel characteristics. I provide hands-on execution from localization strategy development to UX adjustments and digital marketing implementation—delivering results in the local market.',
      deliverables: [
        'Japan market demand research and persona design',
        'Localization strategy (messaging / tone / UX)',
        'Product/service market adaptation testing (A/B)',
        'Japan-focused advertising and distribution channel design/operations',
        'Local partner selection and collaboration launch support',
        'User testing and qualitative insight gathering in Japan'
      ],
      intent: 'Rather than importing overseas approaches as-is, we redesign "what to deliver and how" based on Japan\'s realities, balancing short-term launch success with long-term expansion.'
    },
    {
      id: 'ai-operational-design',
      title: 'AI Operational Design',
      subtitle: 'Embedding generative AI into business and marketing operations. Eliminating dependency on individuals through reproducible workflow design and SOP development.',
      description: 'We don\'t just hand over tools and call it done. We integrate generative AI into daily business and marketing operations—content creation, research, data analysis, customer support. We design systems (SOPs: Standard Operating Procedures) that anyone can execute with consistent quality, creating self-sustaining teams and supporting operational adoption.',
      deliverables: [
        'Business process analysis and AI opportunity identification',
        'Generative AI workflow design (utilizing no-code tools like n8n, Zapier)',
        'SOP (Standard Operating Procedures) development and template creation',
        'Team AI training and onboarding',
        'Knowledge base construction and continuous improvement cycle design'
      ],
      intent: 'From "individuals using tools" to "teams functioning with tools." Embedding generative AI as part of operations to simultaneously increase productivity and reproducibility.'
    }
  ];

  const works = [
    {
      title: 'Brand Localization',
      items: [
        {
          title: 'Forex Product Landing Page (Freelance)',
          description: 'Landing page creation and campaign localization for Forex product',
          link: 'https://www.axiory.com/jp/trading-products/clash-cfds',
          cta: 'See the Sample'
        },
        {
          title: 'High Jewelry Collection Campaign (Boucheron)',
          description: 'Product page and campaign localization for high jewelry collection',
          link: 'https://www.boucheron.com/ja_jp/high-jewelry/collections-carte-blanche/ailleurs',
          cta: 'See the Sample'
        },
        {
          title: 'Sustainability Program (Boucheron)',
          description: 'Sustainability program localization and content management',
          link: 'https://www.boucheron.com/ja_jp/our-maison/sustainability',
          cta: 'See the Sample'
        },
        {
          title: 'Advertising Campaign (Boucheron)',
          description: 'Campaign page localization and content strategy',
          link: 'https://www.boucheron.com/ja_jp/our-maison/the-sense-of-style/the-quatre-icon',
          cta: 'See the Sample'
        },
        {
          title: 'Amazon Prime Day (Computer Futures)',
          description: 'Program localization of Amazon Prime Day and related pages for the Japan market',
          link: 'https://www.amazon.co.jp/primeday',
          cta: 'See the Sample'
        }
      ]
    },
    {
      title: 'Web, E-commerce, Social Media Account Growth',
      items: [
        {
          title: 'Boucheron Japan E-commerce',
          description: 'E-commerce management and content strategy',
          link: 'https://www.boucheron.com/ja_jp/',
          cta: 'See the Sample'
        },
        {
          title: 'AXIORY Forex Broker Japan',
          description: 'Website content management and localization',
          link: 'https://www.axiory.com/jp/',
          cta: 'See the Sample'
        },
        {
          title: 'Boucheron Japan Social Media',
          description: 'Management of LINE (200K followers), Facebook (246K followers), and X (9K followers) accounts',
          link: 'https://page.line.me/625rfwps',
          cta: 'See the Sample'
        },
        {
          title: 'Paul Smith Japan Social Media',
          description: 'Management of Instagram (120K followers), Facebook (68K followers), and X (52K followers) accounts',
          link: 'https://www.instagram.com/paulsmithjapan/',
          cta: 'See the Sample'
        }
      ]
    },
    {
      title: 'Creative Direction and Production',
      items: [
        {
          title: 'Paul Smith Japan Instagram Direction',
          description: 'Photo-shooting direction for Instagram account (40+ photo-shoots)',
          link: 'https://www.instagram.com/p/CEoUtZADLyG/?img_index=1',
          cta: 'Sample Photo 01Sample Photo 02Sample Photo 03'
        },
        {
          title: 'Red Ear Campaign',
          description: 'Campaign photo-shoot direction for Paul Smith',
          link: 'https://www.paulsmith.co.jp/stories/aw19/red-ear',
          cta: 'AW19 CampaignSS20 Campaign'
        },
        {
          title: 'Personal Photography',
          description: 'Photography portfolio',
          link: 'https://www.instagram.com/fumi_fumar/',
          cta: 'See the Sample'
        }
      ]
    },
    {
      title: 'Data Visualization & Analytics Integration',
      items: [
        {
          title: 'Looker Studio Dashboard',
          description: 'Sample report with customizable data integration',
          link: 'https://lookerstudio.google.com/u/0/reporting/37687a85-8c92-4e75-93a9-a081f4c41208/page/vXEHE',
          cta: 'See the Sample'
        }
      ]
    },
    {
      title: 'Web Projects',
      items: [
        {
          title: 'Save GPT',
          description: 'Google Chrome extension to save responses from ChatGPT to Notion',
          link: 'https://chromewebstore.google.com/detail/save-gpt/nbkjfkkjfgacnebnboacljgdglfigmeg',
          cta: 'Visit Site'
        },
        {
          title: 'GenAI ✖️ PLP (Product Listing)',
          description: 'Created a genAI video transition from model/product image on e-commerce',
          link: 'https://balenciaga-ambassador-clone.vercel.app/',
          cta: 'Visit Site'
        },
        {
          title: 'Unmanned Newsroom - AI powered',
          description: 'Latest tech and AI news, automatically curated',
          link: 'https://www.unmanned-newsroom.com/',
          cta: 'Visit Site'
        },
        {
          title: 'Georgia News - AI powered',
          description: 'Read Georgian Local News in Japanese',
          link: 'https://georgia-news-japan.online/',
          cta: 'Visit Site'
        }
      ]
    }
  ];

  const [writings, setWritings] = useState<BlogPost[]>([]);

  useEffect(() => {
    const fetchWritings = async () => {
      try {
        const response = await fetch('/api/blog');
        if (!response.ok) throw new Error('Failed to fetch');
        const data = await response.json();
        setWritings(data);
      } catch (error) {
        console.error('Error fetching writings:', error);
      }
    };
    fetchWritings();
  }, []);

  const toggleLanguage = () => setLanguage(language === 'en' ? 'ja' : 'en');

  return (
    <>
      <div className="loading-overlay">
        <div className="loading-spinner">F</div>
      </div>

      {/* Particles */}
      <div className="particles">
        {particles.map((particle) => (
          <div
            key={particle.id}
            className="particle"
            style={{
              left: `${particle.left}%`,
              animationDelay: `${particle.delay}s`,
            }}
          />
        ))}
      </div>

      {/* Background Shapes */}
      <div className="bg-shapes">
        <div className="shape shape2" />
        <div className="shape shape4" />
      </div>

      {/* Main Container */}
      <div className="container">
        <div className="profile-card">
          {/* Language Switch Button - Top Left */}
          <div className="lang-toggle" onClick={toggleLanguage} title={language === 'en' ? '日本語に切り替え' : 'Switch to English'}>
            <span style={{ fontSize: '1.3rem' }}>{language === 'en' ? '🇯🇵' : '🇬🇧'}</span>
          </div>
          {/* Dark Mode Toggle - Top Right */}
          <div className="dark-mode-toggle" onClick={toggleDarkMode}>
            <i className={isDarkMode ? 'fas fa-sun' : 'fas fa-moon'} />
          </div>

          {/* Profile Header */}
          <div className="profile-header">
            <div className="gradient-circle" />
            <div
              className="profile-img clickable"
              onClick={() => setIsProfileModalOpen(true)}
            >
              <img
                src="/profile.jpg"
                alt="fuminozawa Profile"
                className="profile-image"
                width="112"
                height="112"
              />
              <div className="avatar-placeholder">
                <i className="fas fa-user" />
              </div>
            </div>
            <h1
              id="taishiyade-title"
              className="glitch-effect clickable"
              data-text="fuminozawa"
              onClick={() => setIsProfileModalOpen(true)}
            >
              fuminozawa
            </h1>

            <div className="bio-container">
              <ul className="bio-list">
                {language === 'en' ? (
                  <>
                    <li className="chip">All-round Marketer</li>
                    <li className="chip">Web Developer</li>
                    <li className="chip">Japan Market Entry</li>
                    <li className="chip">SaaS Localization</li>
                    <li className="chip">Global Brand Marketing</li>
                    <li className="chip">Vibe Marketing</li>
                    <li className="chip">Paid Media (Google & Meta)</li>
                    <li className="chip">AI-powered Solutions</li>
                    <li className="chip">Solo Product Dev</li>
                    <li className="chip">Lived in 🇯🇵 🇺🇸 🇬🇧 🇨🇦 🇬🇪 🇦🇲</li>
                  </>
                ) : (
                  <>
                    <li className="chip">オールラウンドマーケター</li>
                    <li className="chip">ウェブ開発</li>
                    <li className="chip">日本市場向けマーケット戦略</li>
                    <li className="chip">SaaSローカライゼーション</li>
                    <li className="chip">グローバルブランドマーケティング</li>
                    <li className="chip">バイブマーケ</li>
                    <li className="chip">広告運用（Google & Meta）</li>
                    <li className="chip">AI活用ソリューション</li>
                    <li className="chip">ソロプロダクト開発</li>
                    <li className="chip">🇯🇵 🇺🇸 🇬🇧 🇨🇦 🇬🇪 🇦🇲 での居住経験</li>
                  </>
                )}
              </ul>
            </div>
          </div>

          {/* Tabs Navigation */}
          <div className="achievements-section">
            <div className="tabs-container">
              <div
                className={`tab ${activeTab === 'links' ? 'active' : ''}`}
                onClick={() => handleTabClick('links')}
              >
                Links
              </div>
              <div
                className={`tab ${activeTab === 'services' ? 'active' : ''}`}
                onClick={() => handleTabClick('services')}
              >
                Services
              </div>
              <div
                className={`tab ${activeTab === 'works' ? 'active' : ''}`}
                onClick={() => handleTabClick('works')}
              >
                Works
              </div>
              <div
                className={`tab ${activeTab === 'writing' ? 'active' : ''}`}
                onClick={() => handleTabClick('writing')}
              >
                Blog
              </div>
              <div
                className={`tab ${activeTab === 'gallery' ? 'active' : ''}`}
                onClick={() => window.location.href = '/gallery'}
              >
                Gallery
              </div>
            </div>

            {/* Links Tab Content */}
            <div
              className={`tab-content ${activeTab === 'links' ? 'active' : ''}`}
            >
              <div className="links-container">
                {socialLinks.map((link) => (
                  <a
                    key={link.name}
                    href={link.url}
                    className="link-item"
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      '--accent-color': link.color,
                      opacity: 1,
                      transform: 'translateY(0px)',
                      transition: '0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                    } as React.CSSProperties}
                  >
                    <div className="link-icon">
                      <i className={link.icon} />
                    </div>
                    <div className="link-text">{link.name}</div>
                  </a>
                ))}
                <div
                  className="link-item"
                  onClick={() => setIsEmailModalOpen(true)}
                  style={{
                    '--accent-color': '#EA4335',
                    opacity: 1,
                    transform: 'translateY(0px)',
                    transition: '0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                    cursor: 'pointer',
                  } as React.CSSProperties}
                >
                  <div className="link-icon">
                    <i className="fas fa-envelope" />
                  </div>
                  <div className="link-text">Contact via Email</div>
                </div>
              </div>
            </div>

            {/* Services Tab Content */}
            <div className={`tab-content ${activeTab === 'services' ? 'active' : ''}`}>
              {(language === 'ja' ? services : servicesEn).map((service) => (
                <div key={service.id} className="service-card">
                  <div className="service-header">
                    <h3 className="service-number">{String((language === 'ja' ? services : servicesEn).indexOf(service) + 1).padStart(2, '0')}</h3>
                    <h2 className="service-title">{service.title}</h2>
                  </div>
                  <p className="service-subtitle">{service.subtitle}</p>
                  <p className="service-description">{service.description}</p>

                  <div className="service-deliverables">
                    <h4>{language === 'ja' ? '主な提供内容' : 'Key Deliverables'}</h4>
                    <ul>
                      {service.deliverables.map((item, index) => (
                        <li key={index}>{item}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="service-intent">
                    <h4>{language === 'ja' ? '意図' : 'Intent'}</h4>
                    <p>{service.intent}</p>
                  </div>
                </div>
              ))}

              {/* Methodology Section */}
              <div className="methodology-section">
                <h3>{language === 'ja' ? '方法論（共通）' : 'Methodology (Common)'}</h3>
                <p className="methodology-intro">
                  {language === 'ja'
                    ? 'Diagnosis → Build → Grow をすべての領域で貫きます。'
                    : 'We apply Diagnosis → Build → Grow across all domains.'}
                </p>
                <div className="methodology-steps">
                  <div className="methodology-step">
                    <h4>Diagnosis</h4>
                    <p>{language === 'ja'
                      ? 'データ分析（定量）・UX分析（定性）・ビジネスニーズの照合で、改善ポイントを明確化。'
                      : 'Clarify improvement points through data analysis (quantitative), UX analysis (qualitative), and business needs alignment.'}</p>
                  </div>
                  <div className="methodology-step">
                    <h4>Build</h4>
                    <p>{language === 'ja'
                      ? '必要な改善を要件に落とし、実装（Web・広告・AIワークフロー等）まで行う。'
                      : 'Convert necessary improvements into requirements and execute implementation (Web, advertising, AI workflows, etc.).'}</p>
                  </div>
                  <div className="methodology-step">
                    <h4>Grow</h4>
                    <p>{language === 'ja'
                      ? '実装後に継続的にデータを回し、成果が続く体制にする。'
                      : 'Continuously iterate on data post-implementation to create a system that sustains results.'}</p>
                  </div>
                </div>
              </div>

              {/* Stance Section */}
              <div className="stance-section">
                <h3>{language === 'ja' ? 'スタンス' : 'Stance'}</h3>
                <p>
                  {language === 'ja'
                    ? 'ペインポイントを見定めて、ユーザー目線で（オーディエンスは誰なのかを特定し）、本質的なソリューションを提供する'
                    : 'Identify pain points, adopt a user perspective (identifying who the audience is), and provide essential solutions'}
                </p>
              </div>
            </div>

            {/* Works Tab Content */}
            <div className={`tab-content ${activeTab === 'works' ? 'active' : ''}`}>
              {works.map((category) => (
                <div key={category.title} className="achievement-category">
                  <h3 className="text-lg font-semibold mb-2">{category.title}</h3>
                  <div className="achievement-items">
                    {category.items.map((item) => (
                      <div key={item.title} className="achievement-item">
                        <div className="achievement-details">
                          <h4>{item.title}</h4>
                          <p>{item.description}</p>
                          {item.link && (
                            <a href={item.link} className="achievement-link" target="_blank" rel="noopener noreferrer">
                              {item.cta || 'See the Sample'}
                            </a>
                          )}

                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Writing Tab Content */}
            <div
              className={`tab-content ${activeTab === 'writing' ? 'active' : ''}`}
            >
              {writings.map((writing) => (
                <div key={writing.id} className="achievement-item">
                  <div className="achievement-details">
                    <h3>{writing.title}</h3>
                    <p>{writing.description}</p>
                    <a href={`/blog/${writing.id}`} className="achievement-link">
                      Read Article
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Footer */}
          <footer>
            <p className="copyright">© 2025 fuminozawa - All Rights Reserved</p>
          </footer>
        </div>
      </div>

      {/* Profile Modal */}
      <div className={`modal ${isProfileModalOpen ? 'show' : ''}`}>
        <div className="modal-content">
          <span
            className="close-modal"
            onClick={() => setIsProfileModalOpen(false)}
          >
            ×
          </span>
          {language === 'en' ? (
            <>
              <h2>Masafumi Nozawa</h2>
              <h3>Digital Marketer & Strategist</h3>
              <div className="modal-bio">
                <p>
                  Since 2016, I have been engaged in marketing for fashion, luxury, and technology brands, focusing on communicating brand value accurately and attractively. I have worked on projects for Paul Smith, Boucheron, Amazon Japan, and more, based in Tokyo, London, and Tbilisi (Georgia), bridging global and local perspectives while collaborating with diverse teams and cultures.
                </p>
                <p>
                  I design consistent communication across various online touchpoints, including social media management, website administration, content creation, email marketing, SEO, and data visualization/analytics. In 2023, I studied full-stack web development at Le Wagon Tokyo to strengthen my technical implementation and system understanding. I strive to balance creativity and reproducibility, aiming for both user experience and results.
                </p>
                <p>
                  Currently, as a freelancer, I support localization and brand growth with a focus on storytelling, leveraging my bilingual (Japanese/English) skills. I value the process of translating abstract visions into practical solutions and nurture results through long-term relationships.
                </p>
              </div>
            </>
          ) : (
            <>
              <h2>野澤 眞史（Masafumi Nozawa）</h2>
              <h3>デジタルマーケター & ストラテジスト</h3>
              <div className="modal-bio">
                <p>
                  2016年より、ファッション、ラグジュアリー、テクノロジー領域を中心に、ブランドの価値を的確かつ魅力的に伝えるマーケティング業務に携わる。Paul Smith、Boucheron、Amazon Japanなどのプロジェクトに関わりながら、東京・ロンドン・トビリシ（ジョージア）を拠点に、国内外の多様なチームや文化に触れつつ、グローバルとローカルをつなぐ視点で戦略と実行を担ってきた。
                </p>
                <p>
                  SNS運用やWebサイトの管理、コンテンツ制作、メールマーケティング、SEO、データの可視化や分析など、オンライン上のさまざまな接点で一貫性あるコミュニケーションを設計。2023年にはLe Wagon TokyoにてフルスタックWeb開発を学び、より技術的な実装やシステム理解を強化。創造性と再現性のバランスを取りながら、ユーザー体験と成果の両立を目指してきた。
                </p>
                <p>
                  現在はフリーランスとして、日英バイリンガルの強みを活かしたローカライゼ支援や、ストーリーテリングを軸にしたブランド成長の伴走を行う。抽象的なビジョンを、現場で機能するかたちへと翻訳するプロセスに価値を置き、長期的な関係性の中で成果を育てていくスタイルを大切にしている。
                </p>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Email Modal */}
      <div className={`modal ${isEmailModalOpen ? 'show' : ''}`}>
        <div className="modal-content">
          <span
            className="close-modal"
            onClick={() => setIsEmailModalOpen(false)}
          >
            ×
          </span>
          <h2>{language === 'en' ? 'Contact via Email' : 'メールでのお問い合わせ'}</h2>

          {!showContactForm ? (
            <div className="email-options">
              <button onClick={handleContactFormToggle} className="email-btn">
                {language === 'en' ? 'Contact Form' : 'お問い合わせフォーム'}
              </button>
              <a href="mailto:mf.nozawa@gmail.com" className="email-btn">
                {language === 'en' ? 'Send Email Directly' : '直接メールを送る'}
              </a>
              <button onClick={handleEmailCopy} className="email-btn">
                {language === 'en' ? 'Copy Email Address' : 'メールアドレスをコピー'}
              </button>
              <div
                id="copy-notification"
                className={copyNotification ? 'show' : ''}
              >
                {language === 'en' ? 'Copied!' : 'コピーしました！'}
              </div>
            </div>
          ) : (
            <form className="contact-form" onSubmit={handleFormSubmit}>
              <div className="form-group">
                <label htmlFor="name">{language === 'en' ? 'Name *' : 'お名前 *'}</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  placeholder={language === 'en' ? 'John Smith' : '山田太郎'}
                />
              </div>

              <div className="form-group">
                <label htmlFor="email">{language === 'en' ? 'Email Address *' : 'メールアドレス *'}</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  placeholder={language === 'en' ? 'example@example.com' : 'example@example.com'}
                />
              </div>

              <div className="form-group">
                <label htmlFor="subject">{language === 'en' ? 'Subject' : '件名'}</label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleInputChange}
                  placeholder={language === 'en' ? 'Subject of your inquiry' : 'お問い合わせの件名'}
                />
              </div>

              <div className="form-group">
                <label htmlFor="message">{language === 'en' ? 'Message *' : 'メッセージ *'}</label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  required
                  placeholder={language === 'en' ? 'Please enter your message...' : 'お問い合わせ内容をご記入ください...'}
                />
              </div>

              <div className="form-actions">
                <button type="submit" className="form-btn primary">
                  {language === 'en' ? 'Send' : '送信'}
                </button>
                <button
                  type="button"
                  className="form-btn secondary"
                  onClick={handleContactFormToggle}
                >
                  {language === 'en' ? 'Back' : '戻る'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </>
  );
}
