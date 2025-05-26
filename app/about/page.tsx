import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowRight, Compass, BarChart2, Map, Brain, FileText, HelpCircle } from "lucide-react"
import { Header } from "@/components/header"

export default function AboutPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="py-16 bg-gradient-to-b from-teal-50 to-white">
          <div className="container px-4 md:px-6 text-center">
            <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl mb-6">더 알아보기</h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              MyAI Compass는 AI 시대에 적응하고 성장하기 위한 개인 맞춤형 가이드를 제공합니다. 당신만의 나침반이 되어 AI
              시대의 변화 속에서도 방향을 잃지 않도록 도와드립니다.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link href="/reality-check">
                <Button className="w-full sm:w-auto">
                  지금 시작하기
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link href="/">
                <Button variant="outline" className="w-full sm:w-auto">
                  홈으로 돌아가기
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Service Introduction Section */}
        <section className="py-16 bg-white">
          <div className="container px-4 md:px-6">
            <div className="grid gap-12 lg:grid-cols-2 lg:gap-16 items-center">
              <div>
                <h2 className="text-3xl font-bold tracking-tighter mb-4">서비스 소개 및 미션</h2>
                <p className="text-muted-foreground mb-6">
                  MyAI Compass는 AI 기술의 급속한 발전으로 인한 변화 속에서 개인이 자신의 방향을 찾고 성장할 수 있도록
                  돕기 위해 탄생했습니다. 우리의 미션은 모든 사람이 AI 시대에 적응하고 번영할 수 있도록 개인화된
                  가이드와 도구를 제공하는 것입니다.
                </p>
                <p className="text-muted-foreground">
                  AI는 우리의 일과 삶을 근본적으로 변화시키고 있습니다. 이러한 변화는 두려움의 대상이 아닌 기회가 될 수
                  있습니다. MyAI Compass는 당신이 AI를 이해하고, 활용하며, 함께 성장할 수 있는 여정을 안내합니다.
                </p>
              </div>
              <div className="relative">
                <div className="aspect-video rounded-lg overflow-hidden bg-gray-100 flex items-center justify-center">
                  <img
                    src="/ai-compass-illustration.png"
                    alt="AI Compass Concept"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Main Features Section */}
        <section className="py-16 bg-gray-50">
          <div className="container px-4 md:px-6">
            <h2 className="text-3xl font-bold tracking-tighter text-center mb-12">주요 기능</h2>
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
              <FeatureCard
                icon={<BarChart2 className="h-10 w-10 text-teal-600" />}
                title="Reality Check"
                description="나의 현재 상태를 체크리스트로 진단하고 AI 시대 준비 상태를 파악합니다."
              />
              <FeatureCard
                icon={<Map className="h-10 w-10 text-teal-600" />}
                title="Action Roadmap"
                description="체크리스트 결과를 기반으로 개인 맞춤형 발전 로드맵을 제공합니다."
              />
              <FeatureCard
                icon={<Brain className="h-10 w-10 text-teal-600" />}
                title="Growth Quest"
                description="창의적 성장을 위한 퀘스트 중심의 자기 성장 훈련을 제공합니다."
              />
              <FeatureCard
                icon={<FileText className="h-10 w-10 text-teal-600" />}
                title="Monthly Report"
                description="매달 자동 생성되는 나의 업스킬 & 적응 현황 보고서를 확인합니다."
              />
            </div>
          </div>
        </section>

        {/* How to Use Section */}
        <section className="py-16 bg-white">
          <div className="container px-4 md:px-6">
            <h2 className="text-3xl font-bold tracking-tighter text-center mb-12">사용 방법</h2>
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
              <StepCard number="1" title="회원가입" description="간단한 이메일 인증으로 MyAI Compass에 가입합니다." />
              <StepCard
                number="2"
                title="Reality Check 진단"
                description="AI 시대 적응 상태를 진단하는 체크리스트를 작성합니다."
              />
              <StepCard
                number="3"
                title="맞춤형 로드맵 확인"
                description="진단 결과를 기반으로 생성된 개인 맞춤형 로드맵을 확인합니다."
              />
              <StepCard
                number="4"
                title="퀘스트 수행 및 성장"
                description="다양한 퀘스트를 수행하며 AI 시대에 적응하고 성장합니다."
              />
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-16 bg-gray-50">
          <div className="container px-4 md:px-6">
            <h2 className="text-3xl font-bold tracking-tighter text-center mb-12">자주 묻는 질문</h2>
            <div className="grid gap-6 md:grid-cols-2 max-w-4xl mx-auto">
              <FaqCard
                question="MyAI Compass는 무료인가요?"
                answer="기본 기능은 무료로 제공됩니다. 추후 프리미엄 기능이 추가될 수 있습니다."
              />
              <FaqCard
                question="어떤 AI 모델을 사용하나요?"
                answer="Google의 Gemini 모델을 기반으로 한 AI 시스템을 사용하여 개인화된 인사이트와 추천을 제공합니다."
              />
              <FaqCard
                question="내 데이터는 어떻게 보호되나요?"
                answer="모든 사용자 데이터는 암호화되어 안전하게 저장되며, 개인정보 보호 정책에 따라 엄격하게 관리됩니다."
              />
              <FaqCard
                question="Reality Check는 얼마나 자주 해야 하나요?"
                answer="3개월마다 한 번씩 Reality Check를 수행하여 변화와 성장을 추적하는 것을 권장합니다."
              />
              <FaqCard
                question="퀘스트는 어떻게 완료하나요?"
                answer="각 퀘스트에는 단계별 가이드가 제공됩니다. 퀘스트를 완료한 후 자신의 경험을 기록하고 AI 피드백을 받을 수 있습니다."
              />
              <FaqCard
                question="다른 사용자와 소통할 수 있나요?"
                answer="현재는 개인 학습 경험에 초점을 맞추고 있으며, 향후 커뮤니티 기능을 추가할 예정입니다."
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

function FeatureCard({ icon, title, description }) {
  return (
    <Card className="overflow-hidden">
      <CardContent className="p-6">
        <div className="flex flex-col items-center text-center">
          <div className="mb-4 p-3 bg-teal-50 rounded-full">{icon}</div>
          <h3 className="text-xl font-bold mb-2">{title}</h3>
          <p className="text-muted-foreground text-sm">{description}</p>
        </div>
      </CardContent>
    </Card>
  )
}

function StepCard({ number, title, description }) {
  return (
    <Card className="overflow-hidden">
      <CardContent className="p-6">
        <div className="flex flex-col items-center text-center">
          <div className="w-10 h-10 rounded-full bg-teal-100 text-teal-600 flex items-center justify-center font-bold text-lg mb-4">
            {number}
          </div>
          <h3 className="text-xl font-bold mb-2">{title}</h3>
          <p className="text-muted-foreground text-sm">{description}</p>
        </div>
      </CardContent>
    </Card>
  )
}

function FaqCard({ question, answer }) {
  return (
    <Card className="overflow-hidden">
      <CardContent className="p-6">
        <div className="flex items-start gap-4">
          <HelpCircle className="h-5 w-5 text-teal-600 mt-1 flex-shrink-0" />
          <div>
            <h4 className="font-bold mb-2">{question}</h4>
            <p className="text-muted-foreground text-sm">{answer}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
