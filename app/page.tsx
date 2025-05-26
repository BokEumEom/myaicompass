import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, Compass, BarChart, Map, Brain, FileText } from "lucide-react"
import { Header } from "@/components/header"

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="py-20 bg-gradient-to-b from-teal-50 to-white">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
              <div className="space-y-4">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">MyAI Compass</h1>
                <p className="text-xl text-muted-foreground">AI 시대에도 나만의 방향을 잃지 않도록</p>
                <p className="text-muted-foreground">
                  AI 시대에 적응하고 성장하기 위한 개인 맞춤형 가이드를 제공합니다. 자가진단부터 맞춤형 로드맵, 창의적
                  성장 퀘스트까지 - 당신만의 나침반이 되어드립니다.
                </p>
                <div className="flex flex-col sm:flex-row gap-3">
                  <Link href="/reality-check">
                    <Button className="w-full sm:w-auto">
                      지금 시작하기
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                  <Link href="/dashboard">
                    <Button variant="outline" className="w-full sm:w-auto">
                      대시보드 보기
                    </Button>
                  </Link>
                  <Link href="/about">
                    <Button variant="outline" className="w-full sm:w-auto">
                      더 알아보기
                    </Button>
                  </Link>
                </div>
              </div>
              <div className="mx-auto lg:mx-0 relative">
                <img
                  src="/placeholder-t2y99.png"
                  alt="AI Compass Illustration"
                  className="rounded-lg object-cover shadow-xl"
                  width={500}
                  height={400}
                />
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16 bg-white">
          <div className="container px-4 md:px-6">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold tracking-tighter">주요 기능</h2>
              <p className="text-muted-foreground mt-4 max-w-2xl mx-auto">
                AI 시대에 적응하고 성장하기 위한 4가지 핵심 기능을 제공합니다.
              </p>
            </div>
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
              <FeatureCard
                icon={<BarChart className="h-10 w-10 text-teal-600" />}
                title="Reality Check"
                description="나의 현재 상태를 체크리스트로 진단하고 AI 시대 준비 상태를 파악합니다."
                href="/reality-check"
              />
              <FeatureCard
                icon={<Map className="h-10 w-10 text-teal-600" />}
                title="Action Roadmap"
                description="체크리스트 결과를 기반으로 개인 맞춤형 발전 로드맵을 제공합니다."
                href="/roadmap"
              />
              <FeatureCard
                icon={<Brain className="h-10 w-10 text-teal-600" />}
                title="Growth Quest"
                description="창의적 성장을 위한 퀘스트 중심의 자기 성장 훈련을 제공합니다."
                href="/quests"
              />
              <FeatureCard
                icon={<FileText className="h-10 w-10 text-teal-600" />}
                title="Monthly Report"
                description="매달 자동 생성되는 나의 업스킬 & 적응 현황 보고서를 확인합니다."
                href="/reports"
              />
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section className="py-16 bg-gray-50">
          <div className="container px-4 md:px-6">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold tracking-tighter">어떻게 작동하나요?</h2>
              <p className="text-muted-foreground mt-4 max-w-2xl mx-auto">
                MyAI Compass는 4단계 프로세스를 통해 AI 시대에 적응하고 성장할 수 있도록 도와줍니다.
              </p>
            </div>
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
              <StepCard
                number="1"
                title="자가진단"
                description="Likert scale 방식의 체크리스트로 현재 상태를 진단합니다."
              />
              <StepCard
                number="2"
                title="맞춤형 로드맵"
                description="진단 결과를 기반으로 개인 맞춤형 발전 로드맵을 제공합니다."
              />
              <StepCard number="3" title="성장 퀘스트" description="창의적 성장을 위한 다양한 퀘스트를 수행합니다." />
              <StepCard
                number="4"
                title="성과 분석"
                description="월간 보고서를 통해 성장 과정을 추적하고 분석합니다."
              />
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-teal-50">
          <div className="container px-4 md:px-6 text-center">
            <h2 className="text-3xl font-bold tracking-tighter mb-4">지금 바로 시작하세요</h2>
            <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
              AI 시대에 적응하고 성장하기 위한 첫 걸음을 내딛어보세요. 무료로 Reality Check를 시작할 수 있습니다.
            </p>
            <Link href="/reality-check">
              <Button size="lg" className="px-8">
                무료로 진단받기
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </section>
      </main>

      <footer className="border-t py-6 md:py-8">
        <div className="container flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left">
          <div className="flex items-center gap-2">
            <Compass className="h-5 w-5 text-teal-600" />
            <span className="text-sm font-medium">MyAI Compass</span>
          </div>
          <div className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} MyAI Compass. All rights reserved.
          </div>
          <div className="flex items-center gap-4">
            <Link href="/terms" className="text-xs text-muted-foreground hover:underline">
              이용약관
            </Link>
            <Link href="/privacy" className="text-xs text-muted-foreground hover:underline">
              개인정보처리방침
            </Link>
            <Link href="/contact" className="text-xs text-muted-foreground hover:underline">
              문의하기
            </Link>
          </div>
        </div>
      </footer>
    </div>
  )
}

function FeatureCard({ icon, title, description, href }) {
  return (
    <Link href={href}>
      <div className="flex flex-col items-center text-center p-6 bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
        <div className="mb-4">{icon}</div>
        <h3 className="text-xl font-bold mb-2">{title}</h3>
        <p className="text-muted-foreground text-sm">{description}</p>
      </div>
    </Link>
  )
}

function StepCard({ number, title, description }) {
  return (
    <div className="flex flex-col items-center text-center p-6 bg-white rounded-lg border border-gray-200">
      <div className="w-10 h-10 rounded-full bg-teal-100 text-teal-600 flex items-center justify-center font-bold text-lg mb-4">
        {number}
      </div>
      <h3 className="text-xl font-bold mb-2">{title}</h3>
      <p className="text-muted-foreground text-sm">{description}</p>
    </div>
  )
}
