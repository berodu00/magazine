-- 4.2.1 users (사용자)
CREATE TABLE IF NOT EXISTS users (
    user_id BIGSERIAL PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    name VARCHAR(100) NOT NULL,
    department VARCHAR(100),
    role VARCHAR(20) NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);

-- 4.2.2 categories (카테고리 마스터)
CREATE TABLE IF NOT EXISTS categories (
    category_id BIGSERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE,
    display_order INT NOT NULL DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 4.2.3 hashtags (해시태그)
CREATE TABLE IF NOT EXISTS hashtags (
    hashtag_id BIGSERIAL PRIMARY KEY,
    tag_name VARCHAR(50) NOT NULL UNIQUE,
    usage_count INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_hashtags_name ON hashtags(tag_name);

-- 4.2.4 articles (사보 게시물)
CREATE TABLE IF NOT EXISTS articles (
    article_id BIGSERIAL PRIMARY KEY,
    category_id BIGINT NOT NULL REFERENCES categories(category_id),
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    summary TEXT,
    thumbnail_url VARCHAR(500),
    author_id BIGINT NOT NULL REFERENCES users(user_id),
    view_count INT DEFAULT 0,
    is_published BOOLEAN DEFAULT FALSE,
    published_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_articles_category ON articles(category_id);
CREATE INDEX IF NOT EXISTS idx_articles_author ON articles(author_id);
CREATE INDEX IF NOT EXISTS idx_articles_published ON articles(is_published, published_at);
CREATE INDEX IF NOT EXISTS idx_articles_view_count ON articles(view_count);

-- 4.2.5 article_hashtags (게시물-해시태그 매핑)
CREATE TABLE IF NOT EXISTS article_hashtags (
    article_id BIGINT NOT NULL REFERENCES articles(article_id) ON DELETE CASCADE,
    hashtag_id BIGINT NOT NULL REFERENCES hashtags(hashtag_id) ON DELETE CASCADE,
    PRIMARY KEY (article_id, hashtag_id)
);

CREATE INDEX IF NOT EXISTS idx_article_hashtags_hashtag ON article_hashtags(hashtag_id);

-- 4.2.6 reactions (반응)
CREATE TABLE IF NOT EXISTS reactions (
    reaction_id BIGSERIAL PRIMARY KEY,
    article_id BIGINT NOT NULL REFERENCES articles(article_id) ON DELETE CASCADE,
    user_id BIGINT NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    reaction_type VARCHAR(20) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(article_id, user_id)
);

CREATE INDEX IF NOT EXISTS idx_reactions_article ON reactions(article_id);
CREATE INDEX IF NOT EXISTS idx_reactions_user ON reactions(user_id);

-- 4.2.7 ratings (별점)
CREATE TABLE IF NOT EXISTS ratings (
    rating_id BIGSERIAL PRIMARY KEY,
    article_id BIGINT NOT NULL REFERENCES articles(article_id) ON DELETE CASCADE,
    user_id BIGINT NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    score INT NOT NULL CHECK (score >= 1 AND score <= 5),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(article_id, user_id)
);

CREATE INDEX IF NOT EXISTS idx_ratings_article ON ratings(article_id);
CREATE INDEX IF NOT EXISTS idx_ratings_user ON ratings(user_id);

-- 4.2.8 events (이벤트)
CREATE TABLE IF NOT EXISTS events (
    event_id BIGSERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    thumbnail_url VARCHAR(500),
    start_date TIMESTAMP NOT NULL,
    end_date TIMESTAMP NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    winner_count INT DEFAULT 0,
    winners_announced BOOLEAN DEFAULT FALSE,
    winner_announcement TEXT,
    created_by BIGINT NOT NULL REFERENCES users(user_id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_events_dates ON events(start_date, end_date);
CREATE INDEX IF NOT EXISTS idx_events_active ON events(is_active);

-- 4.2.9 event_participants (이벤트 참여자)
CREATE TABLE IF NOT EXISTS event_participants (
    participant_id BIGSERIAL PRIMARY KEY,
    event_id BIGINT NOT NULL REFERENCES events(event_id) ON DELETE CASCADE,
    user_id BIGINT NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    comment TEXT,
    is_winner BOOLEAN DEFAULT FALSE,
    participated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(event_id, user_id)
);

CREATE INDEX IF NOT EXISTS idx_event_participants_event ON event_participants(event_id);
CREATE INDEX IF NOT EXISTS idx_event_participants_user ON event_participants(user_id);
CREATE INDEX IF NOT EXISTS idx_event_participants_winner ON event_participants(is_winner);

-- 4.2.10 popups (팝업)
CREATE TABLE IF NOT EXISTS popups (
    popup_id BIGSERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    popup_type VARCHAR(20) NOT NULL,
    image_url VARCHAR(500),
    content TEXT,
    link_url VARCHAR(500),
    display_order INT DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    start_date TIMESTAMP NOT NULL,
    end_date TIMESTAMP NOT NULL,
    created_by BIGINT NOT NULL REFERENCES users(user_id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_popups_active ON popups(is_active, start_date, end_date);

-- 4.2.11 banners (롤링 배너)
CREATE TABLE IF NOT EXISTS banners (
    banner_id BIGSERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    image_url VARCHAR(500) NOT NULL,
    link_url VARCHAR(500),
    display_order INT DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_by BIGINT NOT NULL REFERENCES users(user_id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_banners_active ON banners(is_active, display_order);

-- 4.2.12 social_contents (소셜 미디어 콘텐츠)
CREATE TABLE IF NOT EXISTS social_contents (
    content_id BIGSERIAL PRIMARY KEY,
    platform VARCHAR(20) NOT NULL,
    external_id VARCHAR(255) NOT NULL,
    title VARCHAR(255),
    description TEXT,
    thumbnail_url VARCHAR(500),
    link_url VARCHAR(500) NOT NULL,
    published_at TIMESTAMP,
    fetched_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(platform, external_id)
);

CREATE INDEX IF NOT EXISTS idx_social_contents_platform ON social_contents(platform);
CREATE INDEX IF NOT EXISTS idx_social_contents_published ON social_contents(published_at);

-- 4.2.13 ideas (아이디어 제안)
CREATE TABLE IF NOT EXISTS ideas (
    idea_id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    status VARCHAR(20) DEFAULT 'PENDING',
    admin_comment TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_ideas_user ON ideas(user_id);
CREATE INDEX IF NOT EXISTS idx_ideas_status ON ideas(status);

-- 4.2.14 newsletters (뉴스레터)
CREATE TABLE IF NOT EXISTS newsletters (
    newsletter_id BIGSERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    subject VARCHAR(255) NOT NULL,
    sent_at TIMESTAMP,
    recipient_count INT DEFAULT 0,
    created_by BIGINT NOT NULL REFERENCES users(user_id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_newsletters_sent ON newsletters(sent_at);

-- 4.2.15 newsletter_articles (뉴스레터-게시물 매핑)
CREATE TABLE IF NOT EXISTS newsletter_articles (
    newsletter_id BIGINT NOT NULL REFERENCES newsletters(newsletter_id) ON DELETE CASCADE,
    article_id BIGINT NOT NULL REFERENCES articles(article_id) ON DELETE CASCADE,
    display_order INT NOT NULL,
    PRIMARY KEY (newsletter_id, article_id)
);

CREATE INDEX IF NOT EXISTS idx_newsletter_articles_newsletter ON newsletter_articles(newsletter_id);
