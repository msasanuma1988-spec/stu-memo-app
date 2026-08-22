import Link from "next/link";
import {
  ArrowRight,
  ChevronDown,
  LogIn,
  MessageSquare,
  Pencil,
  Globe,
  ShieldCheck,
  Sparkles,
  Tag,
} from "lucide-react";
import { Reveal } from "@/components/Reveal";
import { LandingScrollSnap } from "@/components/LandingScrollSnap";

const features = [
  {
    icon: Tag,
    grad: "grad-4",
    title: "タグで自在に整理",
    body: "書きためた学習メモに複数のタグを付けて分類。あとから探すのも一瞬です。",
  },
  {
    icon: Globe,
    grad: "grad-2",
    title: "公開もワンクリック",
    body: "メモごとに公開・非公開をいつでも切り替え。結果はその場ですぐ画面に反映されます。",
  },
  {
    icon: MessageSquare,
    grad: "grad-1",
    title: "コメントで繋がる",
    body: "公開したメモには、仲間からコメントが届く。学びを一人で抱え込まない。",
  },
  {
    icon: LogIn,
    grad: "grad-5",
    title: "数十秒で始められる",
    body: "必要なのはメールアドレスだけ。複雑な設定なしに、すぐ書き始められます。",
  },
  {
    icon: Pencil,
    grad: "grad-6",
    title: "編集も削除も自由自在",
    body: "自分のメモはいつでも編集・削除OK。他人のメモには手を出せない安心設計。",
  },
  {
    icon: ShieldCheck,
    grad: "grad-3",
    title: "守られたプライバシー",
    body: "行レベルセキュリティ(RLS)で、非公開メモは本人以外には絶対に見えません。",
  },
];

export default function LandingPage() {
  return (
    <div className="landing-page">
      <LandingScrollSnap />

      <section className="landing-section landing-hero">
        <div className="landing-section-inner">
          <Reveal>
            <span className="landing-eyebrow">
              <Sparkles size={13} aria-hidden />
              次世代の学習ノート
            </span>
          </Reveal>

          <Reveal delay={80}>
            <h1>
              書きためたメモを、
              <br />
              <span className="gradient-text">そのままシェアできる。</span>
            </h1>
          </Reveal>

          <Reveal delay={160}>
            <p>
              タグ管理・公開/非公開の切り替え・コメントまで。
              <br />
              学習ノートを、もっと自由に、もっと今どきに。
            </p>
          </Reveal>

          <Reveal delay={240}>
            <div className="landing-cta-row">
              <Link href="/memos" className="button button-primary">
                メモを見てみる
                <ArrowRight size={17} aria-hidden />
              </Link>
              <Link href="/signup" className="button">
                無料で登録
              </Link>
            </div>
          </Reveal>
        </div>

        <div className="landing-scroll-hint">
          スクロール
          <ChevronDown size={16} aria-hidden />
        </div>
      </section>

      <section className="landing-section">
        <div className="landing-section-inner">
          <Reveal>
            <div className="landing-section-heading">
              <span className="landing-eyebrow">できること</span>
              <h2>
                使うほど、<span className="gradient-text">手放せなくなる機能。</span>
              </h2>
              <p>学習メモをもっと快適に。それでいてシンプルに使える機能だけを詰め込みました。</p>
            </div>
          </Reveal>

          <div className="landing-feature-grid">
            {features.map((feature, index) => (
              <Reveal key={feature.title} delay={index * 70}>
                <article className="landing-feature-card">
                  <div className={`landing-feature-icon ${feature.grad}`}>
                    <feature.icon size={24} aria-hidden />
                  </div>
                  <h3>{feature.title}</h3>
                  <p>{feature.body}</p>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="landing-section landing-final">
        <div className="landing-section-inner">
          <Reveal>
            <span className="landing-eyebrow">
              <Sparkles size={13} aria-hidden />
              はじめよう
            </span>
          </Reveal>
          <Reveal delay={80}>
            <h2>
              さあ、<span className="gradient-text">書き始めよう。</span>
            </h2>
          </Reveal>
          <Reveal delay={160}>
            <p>登録は数十秒。メールアドレスだけで、今日から使えます。</p>
          </Reveal>
          <Reveal delay={240}>
            <div className="landing-cta-row">
              <Link href="/signup" className="button button-primary">
                無料でアカウント作成
                <ArrowRight size={17} aria-hidden />
              </Link>
              <Link href="/login" className="button">
                ログイン
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      <p className="landing-footer">学習メモ共有アプリ — 学びを、もっとシェアしやすく。</p>
    </div>
  );
}
