'use client';

import { useEffect, useState } from 'react';

export default function Home() {
  const [activeTab, setActiveTab] = useState('links');
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);
  const [copyNotification, setCopyNotification] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [showContactForm, setShowContactForm] = useState(false);
  const [language, setLanguage] = useState<'en' | 'ja'>('en');
  const [particles, setParticles] = useState<Array<{id: number, left: number, delay: number}>>([]);
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
    document.body.className = 'dark';
  }, []);

  useEffect(() => {
    // Update theme when isDarkMode changes
    document.body.className = isDarkMode ? '' : 'light';
  }, [isDarkMode]);

  const handleTabClick = (tabName: string) => {
    setActiveTab(tabName);
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
      url: 'https://x.com/ge_news_jp',
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

  const products = [
    {
      title: 'Brand Localization',
      items: [
        {
          title: 'Forex Product Landing Page (Freelance)',
          description: 'Landing page creation and campaign localization for Forex product',
          link: 'https://www.axiory.com/jp/trading-products/clash-cfds'
        },
        {
          title: 'High Jewelry Collection Campaign (Boucheron)',
          description: 'Product page and campaign localization for high jewelry collection',
          link: 'https://www.boucheron.com/ja_jp/high-jewelry/collections-carte-blanche/ailleurs'
        },
        {
          title: 'Sustainability Program (Boucheron)',
          description: 'Sustainability program localization and content management',
          link: 'https://www.boucheron.com/ja_jp/our-maison/sustainability'
        },
        {
          title: 'Advertising Campaign (Boucheron)',
          description: 'Campaign page localization and content strategy',
          link: 'https://www.boucheron.com/ja_jp/our-maison/the-sense-of-style/the-quatre-icon'
        },
        {
          title: 'Amazon Prime Day (Computer Futures)',
          description: 'Program localization of Amazon Prime Day and related pages for the Japan market',
          link: 'https://www.amazon.co.jp/primeday'
        }
      ]
    },
    {
      title: 'Web, E-commerce, Social Media Account Growth',
      items: [
        {
          title: 'Boucheron Japan E-commerce',
          description: 'E-commerce management and content strategy',
          link: 'https://www.boucheron.com/ja_jp/'
        },
        {
          title: 'AXIORY Forex Broker Japan',
          description: 'Website content management and localization',
          link: 'https://www.axiory.com/jp/'
        },
        {
          title: 'Boucheron Japan Social Media',
          description: 'Management of LINE (200K followers), Facebook (246K followers), and X (9K followers) accounts',
          link: 'https://page.line.me/625rfwps'
        },
        {
          title: 'Paul Smith Japan Social Media',
          description: 'Management of Instagram (120K followers), Facebook (68K followers), and X (52K followers) accounts',
          link: 'https://www.instagram.com/paulsmithjapan/'
        }
      ]
    },
    {
      title: 'Creative Direction and Production',
      items: [
        {
          title: 'Paul Smith Japan Instagram Direction',
          description: 'Photo-shooting direction for Instagram account (40+ photo-shoots)',
          links: [
            {
              title: 'Sample Photo 01',
              url: 'https://www.instagram.com/p/CEoUtZADLyG/?img_index=1'
            },
            {
              title: 'Sample Photo 02',
              url: 'https://www.instagram.com/p/CB0DeHEDxdS/?img_index=1'
            },
            {
              title: 'Sample Photo 03',
              url: 'https://www.instagram.com/p/CAC8QtkDmJy/?img_index=1'
            }
          ]
        },
        {
          title: 'Red Ear Campaign',
          description: 'Campaign photo-shoot direction for Paul Smith',
          links: [
            {
              title: 'AW19 Campaign',
              url: 'https://www.paulsmith.co.jp/stories/aw19/red-ear'
            },
            {
              title: 'SS20 Campaign',
              url: 'https://www.paulsmith.co.jp/stories/ss20/red-ear'
            }
          ]
        },
        {
          title: 'Personal Photography',
          description: 'Photography portfolio',
          link: 'https://www.instagram.com/fumi_fumar/'
        }
      ]
    },
    {
      title: 'Data Visualization & Analytics Integration',
      items: [
        {
          title: 'Looker Studio Dashboard',
          description: 'Sample report with customizable data integration',
          link: 'https://lookerstudio.google.com/u/0/reporting/37687a85-8c92-4e75-93a9-a081f4c41208/page/vXEHE'
        }
      ]
    }
  ];

  const projects = [
    {
      title: 'Web Projects',
      items: [
        {
          title: 'GenAI ✖️ PLP (Product Listing)',
          description: 'Created a genAI video transition from model/product image on e-commerce',
          link: 'https://balenciaga-ambassador-clone.vercel.app/'
        },
        {
          title: 'Unmanned Newsroom - AI powered',
          description: 'Latest tech and AI news, automatically curated',
          link: 'https://www.unmanned-newsroom.com/'
        },
        {
          title: 'Georgia News - AI powered',
          description: 'Read Georgian Local News in Japanese',
          link: 'https://georgia-news-japan.online/'
        }
      ]
    }
  ];

  const works = [
    {
      title: 'Brand Localization',
      items: [
        {
          title: 'Forex Product Landing Page (Freelance)',
          description: 'Landing page creation and campaign localization for Forex product',
          link: '#',
          cta: 'See the Sample'
        },
        {
          title: 'High Jewelry Collection Campaign (Boucheron)',
          description: 'Product page and campaign localization for high jewelry collection',
          link: '#',
          cta: 'See the Sample'
        },
        {
          title: 'Sustainability Program (Boucheron)',
          description: 'Sustainability program localization and content management',
          link: '#',
          cta: 'See the Sample'
        },
        {
          title: 'Advertising Campaign (Boucheron)',
          description: 'Campaign page localization and content strategy',
          link: '#',
          cta: 'See the Sample'
        },
        {
          title: 'Amazon Prime Day (Computer Futures)',
          description: 'Program localization of Amazon Prime Day and related pages for the Japan market',
          link: '#',
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
          link: '#',
          cta: 'See the Sample'
        },
        {
          title: 'AXIORY Forex Broker Japan',
          description: 'Website content management and localization',
          link: '#',
          cta: 'See the Sample'
        },
        {
          title: 'Boucheron Japan Social Media',
          description: 'Management of LINE (200K followers), Facebook (246K followers), and X (9K followers) accounts',
          link: '#',
          cta: 'See the Sample'
        },
        {
          title: 'Paul Smith Japan Social Media',
          description: 'Management of Instagram (120K followers), Facebook (68K followers), and X (52K followers) accounts',
          link: '#',
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
          link: '#',
          cta: 'Sample Photo 01Sample Photo 02Sample Photo 03'
        },
        {
          title: 'Red Ear Campaign',
          description: 'Campaign photo-shoot direction for Paul Smith',
          link: '#',
          cta: 'AW19 CampaignSS20 Campaign'
        },
        {
          title: 'Personal Photography',
          description: 'Photography portfolio',
          link: '#',
          cta: 'See the Sample'
        }
      ]
    }
  ];

  const writings = [
    {
      title: 'Getting Started with Next.js 13',
      description: 'A comprehensive guide to Next.js 13 features',
      link: 'https://dev.to/fuminozawa/getting-started-with-nextjs-13',
    },
    {
      title: 'TypeScript Best Practices',
      description: 'Writing clean and type-safe code with TypeScript',
      link: 'https://dev.to/fuminozawa/typescript-best-practices',
    }
  ];

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
            <span style={{fontSize: '1.3rem'}}>{language === 'en' ? '🇯🇵' : '🇬🇧'}</span>
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
                    <li className="chip">Localization for Japan Market</li>
                    <li className="chip">Global Brand Marketing</li>
                    <li className="chip">AI-powered Solutions</li>
                    <li className="chip">Vibe Marketing</li>
                    <li className="chip">Solo Product Dev</li>
                    <li className="chip">Paid Media (Google & Meta)</li>
                    <li className="chip">English Consultation</li>
                    <li className="chip">Lived in 🇯🇵 🇺🇸 🇬🇧 🇨🇦 🇬🇪 🇦🇲</li>
                  </>
                ) : (
                  <>
                    <li className="chip">オールラウンドマーケター</li>
                    <li className="chip">ウェブ開発者</li>
                    <li className="chip">日本市場向けローカライゼーション</li>
                    <li className="chip">グローバルブランドマーケティング</li>
                    <li className="chip">AI活用ソリューション</li>
                    <li className="chip">バイブマーケティング</li>
                    <li className="chip">ソロプロダクト開発</li>
                    <li className="chip">広告運用（Google & Meta）</li>
                    <li className="chip">英語学習・留学コンサル</li>
                    <li className="chip">🇯🇵 🇺🇸 🇬🇧 🇨🇦 🇬🇪 🇦🇲 居住経験</li>
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
                className={`tab ${activeTab === 'works' ? 'active' : ''}`}
                onClick={() => handleTabClick('works')}
              >
                Works
              </div>
              <div
                className={`tab ${activeTab === 'products' ? 'active' : ''}`}
                onClick={() => handleTabClick('products')}
              >
                Projects
              </div>
              <div
                className={`tab ${activeTab === 'writing' ? 'active' : ''}`}
                onClick={() => handleTabClick('writing')}
              >
                Blog
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

            {/* Projects Tab Content */}
            <div className={`tab-content ${activeTab === 'products' ? 'active' : ''}`}>
              {projects.map((category) => (
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
                              Visit Site
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
                <div key={writing.title} className="achievement-item">
                  <div className="achievement-details">
                    <h3>{writing.title}</h3>
                    <p>{writing.description}</p>
                    <a href={writing.link} className="achievement-link" target="_blank" rel="noopener noreferrer">
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
              <h3>Digital Marketer / Creative Strategist</h3>
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
              <h3>デジタルマーケター / クリエイティブストラテジスト</h3>
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
          <h2>メールでのお問い合わせ</h2>

          {!showContactForm ? (
            <div className="email-options">
              <button onClick={handleContactFormToggle} className="email-btn">
                お問い合わせフォーム
              </button>
              <a href="mailto:mf.nozawa@gmail.com" className="email-btn">
                直接メールを送る
              </a>
              <button onClick={handleEmailCopy} className="email-btn">
                メールアドレスをコピー
              </button>
              <div
                id="copy-notification"
                className={copyNotification ? 'show' : ''}
              >
                コピーしました！
              </div>
            </div>
          ) : (
            <form className="contact-form" onSubmit={handleFormSubmit}>
              <div className="form-group">
                <label htmlFor="name">お名前 *</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  placeholder="山田太郎"
                />
              </div>

              <div className="form-group">
                <label htmlFor="email">メールアドレス *</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  placeholder="example@example.com"
                />
              </div>

              <div className="form-group">
                <label htmlFor="subject">件名</label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleInputChange}
                  placeholder="お問い合わせの件名"
                />
              </div>

              <div className="form-group">
                <label htmlFor="message">メッセージ *</label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  required
                  placeholder="お問い合わせ内容をご記入ください..."
                />
              </div>

              <div className="form-actions">
                <button type="submit" className="form-btn primary">
                  送信
                </button>
                <button
                  type="button"
                  className="form-btn secondary"
                  onClick={handleContactFormToggle}
                >
                  戻る
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </>
  );
}
