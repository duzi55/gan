/**
 * 治愈画卷共享数据（IN-04）—— 壁纸清单单一数据源
 * 2026-08-31 Claude·新增（小红书《树下的人，好治愈！-优选电脑壁纸01》复刻）：
 *   - 原帖九图：图 2（wall-02.webp）为竖版旋转存储的重复场景
 *     （与图 3 同一棵星空巨树，仅存储方向不同），数据清单不收录，
 *     文件保留在目录内备查；清单按原帖顺序收录其余八张横版壁纸；
 *   - 图片本地入库 /images/inspiration/healing-wall/（webp 已验 RIFF 魔数）——
 *     小红书 CDN 外链带时效签名会过期，严禁直接引用（同 crt/invoice 入库约定）；
 *   - WALLS 同时供满屏画卷（WallViewer）等组件消费——
 *     单一数据源，禁止任何组件另写图片清单（解耦铁律）。
 * 2026-08-31 Claude·修复开发环境裂图：路径前缀改读 NEXT_PUBLIC_BASE_PATH
 *   （构建期内联，同 gallery 页方案）——原先硬编码 /gan 前缀在 next dev
 *   （basePath 为空，见 next.config.ts）下 404；现在 dev 走根路径、
 *   生产构建走 /gan 子路径，双端均正确。
 */

/** 部署子路径前缀：dev 为空串，生产构建内联为 /gan */
const BASE = process.env.NEXT_PUBLIC_BASE_PATH || '';

export interface WallItem {
  /** 本地入库路径（含 BASE 前缀：dev 根路径 / 生产 /gan 子路径） */
  src: string;
  /** 中文图注（画卷标题） */
  title: string;
  /** mono 英文小字（编辑式排版元素） */
  titleEn: string;
}

/** 八幅治愈壁纸（原帖顺序，竖版重复图已剔除） */
export const WALLS: WallItem[] = [
  { src: `${BASE}/images/inspiration/healing-wall/wall-01.webp`, title: '林间溪瀑', titleEn: 'FOREST FALLS' },
  { src: `${BASE}/images/inspiration/healing-wall/wall-03.webp`, title: '星野巨树', titleEn: 'STAR TREE' },
  { src: `${BASE}/images/inspiration/healing-wall/wall-04.webp`, title: '雨落青野', titleEn: 'RAIN FIELD' },
  { src: `${BASE}/images/inspiration/healing-wall/wall-05.webp`, title: '粉日雪原', titleEn: 'PINK SUN' },
  { src: `${BASE}/images/inspiration/healing-wall/wall-06.webp`, title: '金原毡房', titleEn: 'GOLDEN STEPPE' },
  { src: `${BASE}/images/inspiration/healing-wall/wall-07.webp`, title: '积云暮鸟', titleEn: 'CLOUD DUSK' },
  { src: `${BASE}/images/inspiration/healing-wall/wall-08.webp`, title: '海岸青丘', titleEn: 'COAST HILL' },
  { src: `${BASE}/images/inspiration/healing-wall/wall-09.webp`, title: '星河夜行', titleEn: 'STAR RIVER' },
];
