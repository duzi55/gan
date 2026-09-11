/**
 * 江南小景共享数据（IN-09）—— 场景清单单一数据源
 * 2026-09-09 Claude·新增（小红书 -Duduu-《江南》·小景 国风横版场景原画复刻）：
 *   - 原帖六图：图 2（jiangnan-02.webp）为竖版存储的三联拼图
 *     （三格内容与其余单张横版场景重复），数据清单不收录，
 *     文件保留在目录内备查（沿 IN-04 竖版重复图剔除惯例）；
 *     清单按原帖顺序收录其余五张横版「电影美术式场景原画」；
 *   - 图片本地入库 /images/inspiration/jiangnan/（webp 已验 RIFF 魔数）——
 *     小红书 CDN 外链带时效签名会过期，严禁直接引用（同 healing-wall 入库约定）；
 *   - JIANGNAN_SCENES 同时供满屏画卷（JiangnanViewer）等组件消费——
 *     单一数据源，禁止任何组件另写图片清单（解耦铁律）；
 *   - 路径前缀读 NEXT_PUBLIC_BASE_PATH（构建期内联，同 gallery / healing-wall
 *     方案）——dev 走根路径、生产构建走 /gan 子路径，双端均正确。
 */

/** 部署子路径前缀：dev 为空串，生产构建内联为 /gan */
const BASE = process.env.NEXT_PUBLIC_BASE_PATH || '';

export interface JiangnanItem {
  /** 本地入库路径（含 BASE 前缀：dev 根路径 / 生产 /gan 子路径） */
  src: string;
  /** 中文图注（画卷标题） */
  title: string;
  /** mono 英文小字（编辑式排版元素） */
  titleEn: string;
}

/** 五幅江南场景（原帖顺序，竖版三联拼图已剔除） */
export const JIANGNAN_SCENES: JiangnanItem[] = [
  { src: `${BASE}/images/inspiration/jiangnan/jiangnan-01.webp`, title: '古树人家', titleEn: 'OLD TREE' },
  { src: `${BASE}/images/inspiration/jiangnan/jiangnan-03.webp`, title: '樱雾水乡', titleEn: 'MIST & BLOSSOM' },
  { src: `${BASE}/images/inspiration/jiangnan/jiangnan-04.webp`, title: '绢本青绿', titleEn: 'SILK SCROLL' },
  { src: `${BASE}/images/inspiration/jiangnan/jiangnan-05.webp`, title: '孤村水镜', titleEn: 'WATER ISLET' },
  { src: `${BASE}/images/inspiration/jiangnan/jiangnan-06.webp`, title: '月门灯笼', titleEn: 'MOON GATE' },
];
