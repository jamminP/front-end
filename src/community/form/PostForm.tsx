import React, { useEffect, useMemo, useState } from 'react';

export type PostFormValues = {
  title: string;
  content: string;
  category: 'free' | 'share' | 'study';
  recruitStart?: string;
  recruitEnd?: string;
  studyStart?: string;
  studyEnd?: string;
  maxMembers?: number;
};

interface PostFormProps {
  initialValues?: Partial<PostFormValues>;
  submitLabel?: string;
  onSubmit: (values: PostFormValues) => void;
  disabled?: boolean;
}

const defaults: PostFormValues = {
  title: '',
  content: '',
  category: 'free',
};

type Errors = Partial<Record<keyof PostFormValues | 'limitMembers', string>>;

function validate(values: PostFormValues, limitMembers: boolean): Errors {
  const e: Errors = {};
  const req = (v?: string) => v && v.trim().length > 0;

  if (!req(values.title)) e.title = '제목은 필수입니다.';
  if (!req(values.content)) e.content = '내용은 필수입니다.';

  if (values.category === 'study') {
    const RS = values.recruitStart ?? '';
    const RE = values.recruitEnd ?? '';
    const SS = values.studyStart ?? '';
    const SE = values.studyEnd ?? '';

    if (RS && RE && RS > RE) e.recruitEnd = '모집 마감은 시작 이후여야 합니다.';
    if (SS && SE && SS > SE) e.studyEnd = '스터디 종료는 시작 이후여야 합니다.';

    if (limitMembers) {
      if (values.maxMembers == undefined || Number.isNaN(values.maxMembers)) {
        e.maxMembers = '최대 인원을 입력해주세요.';
      } else if (!Number.isInteger(values.maxMembers)) {
        e.maxMembers = '정수를 입력해주세요.';
      } else if (values.maxMembers < 2) {
        e.maxMembers = '2명 이상이어야 합니다.';
      } else if (values.maxMembers > 30) {
        e.maxMembers = '최대 인원은 30명을 넘을 수 없습니다.';
      }
    }
  }
  return e;
}

export default function PostForm({
  initialValues,
  submitLabel = '등록',
  onSubmit,
  disabled,
}: PostFormProps) {
  const [values, setValues] = useState<PostFormValues>({ ...defaults, ...initialValues });
  const [limitMembers, setLimitMembers] = useState<boolean>(
    (initialValues?.maxMembers ?? undefined) !== undefined,
  );
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  useEffect(() => {
    setValues((prev) => ({ ...prev, ...initialValues }));
  }, [initialValues]);

  const isStudy = values.category === 'study';
  const errors = useMemo(
    () => validate(values, isStudy && limitMembers),
    [values, limitMembers, isStudy],
  );
  const hasError = Object.keys(errors).length > 0;

  const setField =
    (name: keyof PostFormValues) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      const raw = e.target.value;
      setValues((v) => ({
        ...v,
        [name]:
          name === 'maxMembers' ? (raw === '' ? undefined : Math.floor(Number(raw))) : (raw as any),
      }));
    };

  const onBlur = (name: keyof PostFormValues | 'limitMembers') => () =>
    setTouched((t) => ({ ...t, [name]: true }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setTouched({
      title: true,
      content: true,
      category: true,
      recruitStart: true,
      recruitEnd: true,
      studyStart: true,
      studyEnd: true,
      maxMembers: true,
      limitMembers: true,
    });
    if (hasError) return;
    const payload: PostFormValues = {
      ...values,
      maxMembers: isStudy && limitMembers ? values.maxMembers : undefined,
    };

    onSubmit(values);
  };

  const err = (k: keyof PostFormValues | 'limitMembers') => touched[k];

  return (
    <form onSubmit={handleSubmit} className="space-y-4 mt-20 ">
      <div>
        <input
          name="title"
          value={values.title}
          onChange={setField('title')}
          onBlur={onBlur('title')}
          placeholder="제목을 입력하세요"
          disabled={disabled}
          className={`w-full h-10 border border-gray-300 rounded-md px-4 py-3 ${
            err('title') ? 'border-red-500' : 'border-#1B3043'
          }`}
        />
        {err('title') && <p className="text-red-500 text-sm">{errors.title}</p>}
      </div>

      <div>
        <select
          name="category"
          value={values.category}
          onChange={setField('category')}
          onBlur={onBlur('category')}
          disabled={disabled}
          className="w-full h-10 border border-gray-300 rounded-md px-3 py-2 border-#1B3043"
        >
          <option value="free">자유</option>
          <option value="share">자료 공유</option>
          <option value="study">스터디</option>
        </select>
      </div>
      {isStudy && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm  font-medium mb-1 ">모집 시작일</label>
            <input
              type="date"
              name="recruitStart"
              value={values.recruitStart ?? ''}
              onChange={setField('recruitStart')}
              onBlur={onBlur('recruitStart')}
              disabled={disabled}
              className="w-full h-10 border rounded-md px-3 py-2 border-gray-300"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">모집 마감일</label>
            <input
              type="date"
              name="recruitEnd"
              value={values.recruitEnd ?? ''}
              onChange={setField('recruitEnd')}
              onBlur={onBlur('recruitEnd')}
              disabled={disabled}
              className={`w-full h-10 border rounded-md px-3 py-2 ${
                err('recruitEnd') ? 'border-red-400' : 'border-gray-300'
              }`}
            />
            {err('recruitEnd') && <p className="mt-1 text-xs text-red-500">{errors.recruitEnd}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">스터디 시작일</label>
            <input
              type="date"
              name="studyStart"
              value={values.studyStart ?? ''}
              onChange={setField('studyStart')}
              onBlur={onBlur('studyStart')}
              disabled={disabled}
              className="w-full border h-10 rounded-md px-3 py-2 border-gray-300"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">스터디 종료일</label>
            <input
              type="date"
              name="studyEnd"
              value={values.studyEnd ?? ''}
              onChange={setField('studyEnd')}
              onBlur={onBlur('studyEnd')}
              disabled={disabled}
              className={`w-full h-10 border rounded-md px-3 py-2 ${
                err('studyEnd') ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {err('studyEnd') && <p className="mt-1 text-xs text-red-500">{errors.studyEnd}</p>}
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium mb-2">모집 인원</label>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => {
                  setLimitMembers(true);
                  setValues((v) => ({
                    ...v,
                    maxMembers:
                      v.maxMembers && v.maxMembers >= 2
                        ? Math.min(30, Math.floor(v.maxMembers))
                        : 2,
                  }));
                }}
                onBlur={onBlur('limitMembers')}
                className={`px-1 py-1 w-20 text-sm rounded-md border ${
                  limitMembers
                    ? 'bg-[#1B3043] text-white border-black'
                    : 'bg-white text-black border-slate-300'
                }`}
                disabled={disabled}
              >
                인원수 제한
              </button>

              <button
                type="button"
                onClick={() => {
                  setLimitMembers(false);
                  setValues((v) => ({ ...v, maxMembers: undefined }));
                }}
                onBlur={onBlur('limitMembers')}
                className={`px-1 py-1 w-20 text-sm rounded-md border ${
                  !limitMembers
                    ? 'bg-[#1B3043] text-white border-black'
                    : 'bg-white text-black border-slate-300'
                }`}
                disabled={disabled}
              >
                무제한
              </button>
            </div>

            {limitMembers && (
              <div className="mt-3">
                <input
                  type="number"
                  min={2}
                  max={30}
                  step={1}
                  name="maxMembers"
                  value={values.maxMembers ?? ''}
                  onChange={setField('maxMembers')}
                  onBlur={onBlur('maxMembers')}
                  disabled={disabled}
                  className={`w-full border rounded-md px-3 py-2 ${
                    err('maxMembers') && errors.maxMembers ? 'border-red-400' : 'border-gray-300'
                  }`}
                  placeholder="최대 30명"
                />
                {err('maxMembers') && errors.maxMembers && (
                  <p className="mt-1 text-xs text-red-500">{errors.maxMembers}</p>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      <div>
        <textarea
          name="content"
          value={values.content}
          onChange={setField('content')}
          onBlur={onBlur('content')}
          placeholder="내용을 입력하세요"
          disabled={disabled}
          className={`w-full border border-gray-300 rounded-md px-3 py-2 min-h-[400px] ${
            err('content') ? 'border-red-400' : 'border-gray-300'
          }`}
        />
        {err('content') && <p className="text-red-500 text-sm">{errors.content}</p>}
      </div>
      <div className="flex justify-end gap-2">
        <button
          type="submit"
          className="px-4 py-2 rounded-md bg-black text-white disabled:opacity-60"
          disabled={disabled}
        >
          {submitLabel}
        </button>
      </div>
    </form>
  );
}
