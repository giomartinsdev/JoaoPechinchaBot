export const EMOJIS = ['🔵', '🟢', '⚫', '💖', '⚪️', '🟠', '🟤', '🧨', '🟡', '⭐', '🛍️', '💥', '🚨,', '🚚'];
export const FORBIDDEN_WORDS = ['grupo', 'produtos', 'promoção', 'frete', 'pegar', 'avaliação', 'clique', 'exclusivo', 'preço', 'pode', 'inspirado'];
export const PRICE_PATTERN = /R\$\s*\d+[\.,]?\d*/g;
export const URL_PATTERN = /https?:\/\/\S+/g;
export const COUPON_PATTERN = /cupom:?\s*[*]?([\w\d]+)[*]?/gi;
export const PRODUCT_PATTERN = /^(?!.*(R\$|\bpor\b|\bcupom\b|https?:\/\/)).+$/gmi;