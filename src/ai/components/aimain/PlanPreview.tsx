import { PlanData } from '../../types/types';

export default function PlanPreview({ plan }: { plan: PlanData }) {
  if (!plan || typeof plan !== 'object') {
    return <div className="text-sm text-gray-600">표시할 계획 데이터가 없습니다.</div>;
  }

  const meta = [
    plan.total_weeks ? `${plan.total_weeks}주` : null,
    plan.difficulty ? `난이도: ${plan.difficulty}` : null,
    plan.estimated_total_hours ? `예상 ${plan.estimated_total_hours}시간` : null,
    plan.challenge_mode ? '챌린지 모드' : null,
  ].filter(Boolean);

  return (
    <div className="space-y-3">
      <div>
        <div className="text-lg font-semibold">{plan.title || '학습 계획'}</div>
        {meta.length > 0 && (
          <div className="mt-1 flex flex-wrap gap-2">
            {meta.map((m, idx) => (
              <span
                key={idx}
                className="inline-flex items-center px-2 py-0.5 text-xs rounded-full bg-slate-100"
              >
                {m}
              </span>
            ))}
          </div>
        )}
      </div>

      {plan.description && <p className="text-sm text-gray-700">{plan.description}</p>}

      {Array.isArray(plan.weekly_plans) && plan.weekly_plans.length > 0 && (
        <div className="space-y-2">
          <div className="text-sm font-medium text-gray-700">주차별 계획</div>
          <div className="space-y-2">
            {plan.weekly_plans.map((w: any, i: number) => (
              <details
                key={i}
                className="group rounded-xl border p-3 bg-white open:shadow-sm"
                open={i === 0}
              >
                <summary className="cursor-pointer list-none">
                  <div className="flex items-center justify-between">
                    <div className="font-semibold">
                      {w?.week ? `${w.week}주차` : `주차 ${i + 1}`} {w?.title ? `: ${w.title}` : ''}
                    </div>
                    <div className="text-xs text-gray-500 group-open:hidden">펼치기</div>
                    <div className="text-xs text-gray-500 hidden group-open:block">접기</div>
                  </div>
                </summary>

                <div className="mt-3 grid gap-3">
                  {Array.isArray(w?.topics) && (
                    <div className="text-sm">
                      <div className="font-medium text-gray-700 mb-1">주요 주제</div>
                      <ul className="list-disc pl-5 space-y-1">
                        {w.topics.map((t: string, idx: number) => (
                          <li key={idx}>{t}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {Array.isArray(w?.goals) && (
                    <div className="text-sm">
                      <div className="font-medium text-gray-700 mb-1">목표</div>
                      <ul className="list-disc pl-5 space-y-1">
                        {w.goals.map((g: string, idx: number) => (
                          <li key={idx}>{g}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {Array.isArray(w?.daily_goals) && (
                    <div className="text-sm">
                      <div className="font-medium text-gray-700 mb-1">하루 계획</div>
                      <ul className="list-disc pl-5 space-y-1">
                        {w.daily_goals.map((d: string, idx: number) => (
                          <li key={idx}>{d}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {Array.isArray(w?.checkpoints) && (
                    <div className="text-sm">
                      <div className="font-medium text-gray-700 mb-1">체크포인트</div>
                      <ul className="list-disc pl-5 space-y-1">
                        {w.checkpoints.map((c: string, idx: number) => (
                          <li key={idx}>{c}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {(w?.estimated_hours || w?.intensity) && (
                    <div className="text-xs text-gray-600">
                      {w.estimated_hours ? `예상 ${w.estimated_hours}시간` : ''}
                      {w.estimated_hours && w.intensity ? ' · ' : ''}
                      {w.intensity ? `강도: ${w.intensity}` : ''}
                    </div>
                  )}

                  {Array.isArray(w?.challenge_tasks) && w.challenge_tasks.length > 0 && (
                    <div className="text-sm">
                      <div className="font-medium text-gray-700 mb-1">도전 과제</div>
                      <ul className="list-disc pl-5 space-y-1">
                        {w.challenge_tasks.map((t: string, idx: number) => (
                          <li key={idx}>{t}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </details>
            ))}
          </div>
        </div>
      )}

      {Array.isArray(plan.milestones) && plan.milestones.length > 0 && (
        <div>
          <div className="text-sm font-medium text-gray-700 mb-1">마일스톤</div>
          <ul className="text-sm list-disc pl-5 space-y-1">
            {plan.milestones.map((m: any, i: number) => (
              <li key={i}>
                {m?.week ? `${m.week}주차: ` : ''}
                {m?.milestone || m?.title || '마일스톤'}
              </li>
            ))}
          </ul>
        </div>
      )}

      {Array.isArray(plan.tips) && plan.tips.length > 0 && (
        <div>
          <div className="text-sm font-medium text-gray-700 mb-1">학습 팁</div>
          <ul className="text-sm list-disc pl-5 space-y-1">
            {plan.tips.map((t: string, i: number) => (
              <li key={i}>{t}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
