import type { ChecklistItem, Category } from '~/types/checklist'

/**
 * Korea travel checklist presets for May 2026 trip (5泊6日)
 * ツアーコンダクター目線で作成した完璧なチェックリスト
 */
export const KOREA_TEMPLATES: Omit<ChecklistItem, 'id' | 'createdAt' | 'updatedAt' | 'order'>[] = [
  // === ESSENTIALS (必需品) ===
  {
    text: 'パスポート（有効期限6ヶ月以上）',
    category: 'essentials' as Category,
    checked: false,
    priority: 'urgent',
    deadline: new Date('2026-05-06'),
    notes: '日本国籍は90日間ビザ免除。残存期間6ヶ月以上必要',
  },
  {
    text: 'e-Arrival Card（到着3日前までに提出）',
    category: 'essentials' as Category,
    checked: false,
    priority: 'urgent',
    deadline: new Date('2026-05-10'),
    notes: 'https://www.qia.or.kr/ からオンライン事前提出。QRコード保存',
  },
  {
    text: '航空券（Eチケット）',
    category: 'essentials' as Category,
    checked: false,
    priority: 'urgent',
    deadline: new Date('2026-05-12'),
    notes: 'スクリーンショットと印刷の両方を推奨',
  },
  {
    text: 'ホテル予約確認書（5泊分）',
    category: 'essentials' as Category,
    checked: false,
    priority: 'high',
    deadline: new Date('2026-05-12'),
    notes: '各ホテルの住所、電話番号、チェックイン/アウト時間を確認',
  },
  {
    text: '海外旅行保険証券',
    category: 'essentials' as Category,
    checked: false,
    priority: 'high',
    deadline: new Date('2026-05-06'),
    notes: '医療費高額、加入推奨。保険番号と緊急連絡先をメモ',
  },
  {
    text: '現金（日本円・ウォン）',
    category: 'essentials' as Category,
    checked: false,
    priority: 'high',
    deadline: new Date('2026-05-12'),
    notes: '日本円: 万札1万円分、ウォン: 10万ウォン以上',
  },
  {
    text: 'クレジットカード（2枚以上）',
    category: 'essentials' as Category,
    checked: false,
    priority: 'high',
    deadline: new Date('2026-05-12'),
    notes: 'VISA/Mastercardメイン。海外利用手続き済みか確認',
  },
  {
    text: '日本円→ウォン両替',
    category: 'essentials' as Category,
    checked: false,
    priority: 'high',
    deadline: new Date('2026-05-12'),
    notes: '日本で事前両替推奨（レート良）。空港でも可能',
  },
  {
    text: 'パスポートサイズ写真2枚',
    category: 'essentials' as Category,
    checked: false,
    priority: 'low',
    notes: '紛失時の再発行用',
  },

  // === ELECTRONICS (電子機器) ===
  {
    text: 'ユニバーサル変換アダプター（タイプC/F）',
    category: 'electronics' as Category,
    checked: false,
    priority: 'urgent',
    notes: '韓国: タイプC(220V)、日本: タイプA/B(100V)。必須！',
  },
  {
    text: '電圧コンバーター（または220V対応機器のみ）',
    category: 'electronics' as Category,
    checked: false,
    priority: 'urgent',
    notes: '日本の100V機器は変換器必須。ドライヤー等要注意',
  },
  {
    text: 'スマートフォン充電器（USBケーブル含む）',
    category: 'electronics' as Category,
    checked: false,
    priority: 'high',
    notes: 'Night cable（2m以上）推奨',
  },
  {
    text: 'モバイルバッテリー（20,000mAh以下）',
    category: 'electronics' as Category,
    checked: false,
    priority: 'high',
    notes: '機内持込: 100Wh以下(約27,000mAh)。容量規定確認',
  },
  {
    text: 'Wi-Fiルーター/eSIMまたは現地SIM',
    category: 'electronics' as Category,
    checked: false,
    priority: 'high',
    deadline: new Date('2026-05-12'),
    notes: '現地でレンタル、またはeSIMを事前購入推奨',
  },
  {
    text: 'カメラ・レンズ（オプション）',
    category: 'electronics' as Category,
    checked: false,
    priority: 'medium',
    notes: '予備バッテリー、SDカードも',
  },
  {
    text: 'イヤホン・ノイズキャンセリング',
    category: 'electronics' as Category,
    checked: false,
    priority: 'medium',
    notes: '飛行機、移動中に重宝',
  },
  {
    text: 'スマホ用三脚（セルカ棒）',
    category: 'electronics' as Category,
    checked: false,
    priority: 'low',
    notes: 'ソウルの夜景撮影に',
  },

  // === CLOTHING (服装・小物) ===
  {
    text: 'トップス（5-6枚）',
    category: 'clothing' as Category,
    checked: false,
    priority: 'high',
    notes: '5月中旬の気温: 15-25℃。Tシャツ+薄手の長袖',
  },
  {
    text: 'ボトムス（2-3枚）',
    category: 'clothing' as Category,
    checked: false,
    priority: 'high',
    notes: 'ジーンズ、チノパン等。歩きやすいもの',
  },
  {
    text: '上着（カーディガン・ジャケット・パーカー）',
    category: 'clothing' as Category,
    checked: false,
    priority: 'high',
    notes: '朝晩10℃前後。室内も冷房強め',
  },
  {
    text: '下着・靴下（5-6日分）',
    category: 'clothing' as Category,
    checked: false,
    priority: 'high',
  },
  {
    text: '歩きやすい靴（1-2足）',
    category: 'clothing' as Category,
    checked: false,
    priority: 'high',
    notes: 'ソウルは坂道・階段多め。スニーカー推奨',
  },
  {
    text: '靴下（厚手のものも）',
    category: 'clothing' as Category,
    checked: false,
    priority: 'medium',
    notes: '寺院見学時は裸足になる場合あり',
  },
  {
    text: '睡眠着（パジャマ）',
    category: 'clothing' as Category,
    checked: false,
    priority: 'medium',
  },
  {
    text: '洗面用具セット',
    category: 'clothing' as Category,
    checked: false,
    priority: 'medium',
    notes: '歯ブラシ、歯磨き粉、スキンケア等。ホテル備え付け確認',
  },
  {
    text: '常備薬（鎮痛剤、胃薬、絆創膏等）',
    category: 'clothing' as Category,
    checked: false,
    priority: 'medium',
    notes: '処方箋あるものは薬剤師英文等必要',
  },
  {
    text: '日焼け止め・帽子',
    category: 'clothing' as Category,
    checked: false,
    priority: 'medium',
    notes: '5月でも紫外線強め',
  },
  {
    text: '筆記用具・ノート',
    category: 'clothing' as Category,
    checked: false,
    priority: 'low',
  },
  {
    text: 'エコバッグ・折りたたみバッグ',
    category: 'clothing' as Category,
    checked: false,
    priority: 'low',
    notes: 'お土産入れ、レジ袋有料化対応',
  },
  {
    text: 'ハンカチ・ティッシュ',
    category: 'clothing' as Category,
    checked: false,
    priority: 'low',
  },
  {
    text: 'マスク（数枚）',
    category: 'clothing' as Category,
    checked: false,
    priority: 'low',
    notes: '感染症対策、乾燥対策',
  },

  // === KOREA-SPECIFIC (韓国で役立つ) ===
  {
    text: 'T-moneyカード（交通系ICカード）',
    category: 'korea-specific' as Category,
    checked: false,
    priority: 'high',
    notes: '地下鉄・バス共通。コンビニで購入可能（2,500〜3,000ウォン）',
  },
  {
    text: 'Naver Map アプリ（ネイバーマップ）',
    category: 'korea-specific' as Category,
    checked: false,
    priority: 'high',
    notes: '韓国版Google Map。日本語設定可能',
  },
  {
    text: 'Google Translate アプリ',
    category: 'korea-specific' as Category,
    checked: false,
    priority: 'high',
    notes: 'カメラ翻訳機能（韓国語→日本語）重宝',
  },
  {
    text: '韓国語フレーズ集/メモ',
    category: 'korea-specific' as Category,
    checked: false,
    priority: 'medium',
    notes: '「アンニョンハセヨ（こんにちは）」「カムサムニダ（ありがとう）」',
  },
  {
    text: '緊急連絡先メモ',
    category: 'korea-specific' as Category,
    checked: false,
    priority: 'high',
    notes: '日本大使館: +82-2-795-5080、警察: 112、消防・救急: 119',
  },
  {
    text: 'パスポートコピー（写真でOK）',
    category: 'korea-specific' as Category,
    checked: false,
    priority: 'high',
    notes: '紛失時用。クラウド保存も推奨',
  },
  {
    text: 'クレジットカード緊急連絡先',
    category: 'korea-specific' as Category,
    checked: false,
    priority: 'medium',
    notes: '紛失・盗難時の緊急停止連絡先',
  },
  {
    text: 'お土産リスト',
    category: 'korea-specific' as Category,
    checked: false,
    priority: 'low',
    notes: 'キムチ、コスメ、韓国雑貨、乾燥ナムル等',
  },
  {
    text: '観光スポットリスト',
    category: 'korea-specific' as Category,
    checked: false,
    priority: 'medium',
    notes: '景福宮、北村韓屋村、明洞、弘大、江南、漢江公園等',
  },
  {
    text: '食べたいものリスト',
    category: 'korea-specific' as Category,
    checked: false,
    priority: 'low',
    notes: 'サムギョプサル、ビビンバ、チョンタン（冷麺）、チキン等',
  },
  {
    text: '美術館・博物館リスト',
    category: 'korea-specific' as Category,
    checked: false,
    priority: 'low',
    notes: '国立中央博物館、LEEUM、DDP等',
  },

  // === DOCUMENTS (書類・手続き) ===
  {
    text: 'e-Arrival Card提出完了（QRコード保存）',
    category: 'documents' as Category,
    checked: false,
    priority: 'urgent',
    deadline: new Date('2026-05-10'),
    notes: 'https://www.qia.or.kr/（到着3日前まで）',
  },
  {
    text: '海外旅行保険加入手続き',
    category: 'documents' as Category,
    checked: false,
    priority: 'high',
    deadline: new Date('2026-05-06'),
    notes: '損保会社加入、クレジットカード付帯保険確認',
  },
  {
    text: 'クレジットカード海外利用通知',
    category: 'documents' as Category,
    checked: false,
    priority: 'high',
    deadline: new Date('2026-05-10'),
    notes: 'カード会社のアプリまたは電話で海外利用を登録',
  },
  {
    text: '空港Wi-Fi/SIMカード予約',
    category: 'documents' as Category,
    checked: false,
    priority: 'medium',
    deadline: new Date('2026-05-10'),
    notes: '現地でレンタル、またはeSIM事前購入',
  },
  {
    text: '日本出国時のPCR検査（必要な場合）',
    category: 'documents' as Category,
    checked: false,
    priority: 'low',
    notes: '2026年5月時点で検査免除（要確認）',
  },
  {
    text: '韓国入国情報確認',
    category: 'documents' as Category,
    checked: false,
    priority: 'medium',
    deadline: new Date('2026-05-10'),
    notes: 'ビザ、税関、検疫情報を最新確認',
  },
  {
    text: '航空券Webチェックイン',
    category: 'documents' as Category,
    checked: false,
    priority: 'medium',
    deadline: new Date('2026-05-12'),
    notes: 'LCCの場合は必須。座席指定も',
  },
]

/**
 * Travel date for deadline calculations
 */
export const TRAVEL_DATE = new Date('2026-05-13')

/**
 * Recommended deadlines based on travel date
 */
export const RECOMMENDED_DEADLINES = {
  passport: new Date('2026-05-06'), // 7 days before
  eArrivalCard: new Date('2026-05-10'), // 3 days before
  insurance: new Date('2026-05-06'), // 7 days before
  tickets: new Date('2026-05-12'), // 1 day before
  hotel: new Date('2026-05-12'), // 1 day before
  currency: new Date('2026-05-12'), // 1 day before
  simCard: new Date('2026-05-10'), // 3 days before
  overseasCardUse: new Date('2026-05-10'), // 3 days before
}

/**
 * Load Korea travel presets
 */
export function loadKoreaTravelPresets(): ChecklistItem[] {
  const now = new Date()

  return KOREA_TEMPLATES.map((template, index) => ({
    ...template,
    id: crypto.randomUUID(),
    createdAt: now,
    updatedAt: now,
    order: index,
  }))
}

/**
 * Get category item counts for presets
 */
export function getPresetCategoryCounts(): Record<string, number> {
  const counts: Record<string, number> = {}

  KOREA_TEMPLATES.forEach(item => {
    counts[item.category] = (counts[item.category] || 0) + 1
  })

  return counts
}
