import React, { useEffect, useMemo, useState } from 'react';
import { useDropzone } from 'react-dropzone';

const currentUserId = 18;

export type PostFormValues = {
  id: number;
  title: string;
  content: string;
  category: 'free' | 'share' | 'study';
  recruit_start?: string;
  recruit_end?: string;
  study_start?: string;
  study_end?: string;
  max_members?: number;
  freeImages?: File[];
  shareFiles?: File[];
};

interface PostFormProps {
  initialValues?: Partial<PostFormValues>;
  submitLabel?: string;
  onSubmit: (values: PostFormValues) => void;
  disabled?: boolean;
}

const defaults: PostFormValues = {
  id: currentUserId,
  title: '',
  content: '',
  category: 'free',
  freeImages: [],
  shareFiles: [],
};

const BYTES_10MB = 10 * 1024 * 1024;

type Errors = Partial<
  Record<keyof PostFormValues | 'limitMembers' | 'shareLimit' | 'freeLimit', string>
>;

function bytesToMB(n: number) {
  return (n / (1024 * 1024)).toFixed(2);
}

function validate(values: PostFormValues, limitMembers: boolean): Errors {
  const e: Errors = {};
  const req = (v?: string) => v && v.trim().length > 0;

  if (!req(values.title)) e.title = '제목은 필수입니다.';
  if (!req(values.content)) e.content = '내용은 필수입니다.';

  if (values.category === 'study') {
    const RS = values.recruit_start ?? '';
    const RE = values.recruit_end ?? '';
    const SS = values.study_start ?? '';
    const SE = values.study_end ?? '';

    if (RS && RE && RS > RE) e.recruit_end = '모집 마감은 시작 이후여야 합니다.';
    if (SS && SE && SS > SE) e.study_end = '스터디 종료는 시작 이후여야 합니다.';

    if (limitMembers) {
      if (values.max_members == undefined || Number.isNaN(values.max_members)) {
        e.max_members = '최대 인원을 입력해주세요.';
      } else if (!Number.isInteger(values.max_members)) {
        e.max_members = '정수를 입력해주세요.';
      } else if (values.max_members < 2) {
        e.max_members = '2명 이상이어야 합니다.';
      } else if (values.max_members > 30) {
        e.max_members = '최대 인원은 30명을 넘을 수 없습니다.';
      }
    }
  }
  if (values.category === 'free') {
    const imgs = values.freeImages ?? [];
    if (imgs.length > 10) e.freeLimit = '이미지는 최대 10장까지 업로드할 수 있어요.';
    const allow = new Set(['image/png', 'image/jpeg']);
    const bad = imgs.find((f) => !allow.has(f.type));
    if (bad) e.freeLimit = 'PNG 또는 JPG만 업로드할 수 있어요.';
    const total = imgs.reduce((a, f) => a + f.size, 0);
    if (total > BYTES_10MB)
      e.freeLimit = `총 용량은 10MB 이하여야 합니다. (현재 ${bytesToMB(total)}MB)`;
  }

  if (values.category === 'share') {
    const files = values.shareFiles ?? [];
    if (files.length > 10) e.shareLimit = '파일은 최대 10개까지만 업로드할 수 있어요.';
    const total = files.reduce((a, f) => a + f.size, 0);
    if (total > BYTES_10MB)
      e.shareLimit = `총 용량은 10MB 이하여야 합니다. (현재 ${bytesToMB(total)}MB)`;
    const allow = new Set([
      'image/png',
      'image/jpeg',
      'application/pdf',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    ]);
    const bad = files.find((f) => !allow.has(f.type));
    if (bad) e.shareLimit = '허용되지 않는 파일 형식이 있어요. (png, jpg, pdf, docx만 가능)';
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
    (initialValues?.max_members ?? undefined) !== undefined,
  );
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  useEffect(() => {
    setValues((prev) => ({ ...prev, ...initialValues }));
  }, [initialValues]);

  useEffect(() => {
    setValues((v) => {
      if (v.category === 'free') return { ...v, shareFiles: [] };
      if (v.category === 'share') return { ...v, freeImages: [] };
      return v;
    });
  }, [values.category]);

  const isStudy = values.category === 'study';
  const isFree = values.category === 'free';
  const isShare = values.category === 'share';

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
          name === 'max_members'
            ? raw === ''
              ? undefined
              : Math.floor(Number(raw))
            : (raw as any),
      }));
    };

  const onBlur = (name: keyof PostFormValues | 'limitMembers' | 'shareLimit' | 'freeLimit') => () =>
    setTouched((t) => ({ ...t, [name]: true }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setTouched({
      title: true,
      content: true,
      category: true,
      recruit_start: true,
      recruit_end: true,
      study_start: true,
      study_end: true,
      max_members: true,
      limitMembers: true,
      freeImages: true,
      freeLimit: true,
      shareFiles: true,
      shareLimit: true,
    });
    if (hasError) return;
    const payload: PostFormValues = {
      ...values,
      max_members: isStudy && limitMembers ? values.max_members : undefined,
    };

    onSubmit(payload);
  };

  const err = (k: keyof PostFormValues | 'limitMembers' | 'shareLimit' | 'freeLimit') => touched[k];

  const {
    getRootProps: getFreeRootProps,
    getInputProps: getFreeInputProps,
    isDragActive: isFreeDrag,
  } = useDropzone({
    multiple: true,
    accept: { 'image/*': ['.png', '.jpg', '.jpeg'] },
    onDrop: (accepted) => {
      setValues((v) => {
        const next = [...(v.freeImages ?? []), ...accepted];
        const dedup = Array.from(new Map(next.map((f) => [`${f.name}-${f.size}`, f])).values());
        const trimmed = dedup.slice(0, 10);
        return { ...v, freeImages: trimmed };
      });
      setTouched((t) => ({ ...t, freeImages: true, freeLimit: true }));
    },
    disabled: disabled || !isFree,
  });

  const freeTotalSize = (values.freeImages ?? []).reduce((a, f) => a + f.size, 0);

  const {
    getRootProps: getShareRootProps,
    getInputProps: getShareInputProps,
    isDragActive: isShareDrag,
  } = useDropzone({
    multiple: true,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg'],
      'application/pdf': ['.pdf'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
    },
    onDrop: (accepted) => {
      setValues((v) => {
        const next = [...(v.shareFiles ?? []), ...accepted];
        const dedup = Array.from(new Map(next.map((f) => [`${f.name}-${f.size}`, f])).values());
        const trimmed = dedup.slice(0, 10);
        return { ...v, shareFiles: trimmed };
      });
      setTouched((t) => ({ ...t, shareFiles: true, shareLimit: true }));
    },
    disabled: disabled || !isShare,
  });

  const shareTotalSize = (values.shareFiles ?? []).reduce((a, f) => a + f.size, 0);

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
              name="recruit_start"
              value={values.recruit_start ?? ''}
              onChange={setField('recruit_start')}
              onBlur={onBlur('recruit_start')}
              disabled={disabled}
              className="w-full h-10 border rounded-md px-3 py-2 border-gray-300"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">모집 마감일</label>
            <input
              type="date"
              name="recruit_end"
              value={values.recruit_end ?? ''}
              onChange={setField('recruit_end')}
              onBlur={onBlur('recruit_end')}
              disabled={disabled}
              className={`w-full h-10 border rounded-md px-3 py-2 ${
                err('recruit_end') ? 'border-red-400' : 'border-gray-300'
              }`}
            />
            {err('recruit_end') && (
              <p className="mt-1 text-xs text-red-500">{errors.recruit_end}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">스터디 시작일</label>
            <input
              type="date"
              name="study_start"
              value={values.study_start ?? ''}
              onChange={setField('study_start')}
              onBlur={onBlur('study_start')}
              disabled={disabled}
              className="w-full border h-10 rounded-md px-3 py-2 border-gray-300"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">스터디 종료일</label>
            <input
              type="date"
              name="study_end"
              value={values.study_end ?? ''}
              onChange={setField('study_end')}
              onBlur={onBlur('study_end')}
              disabled={disabled}
              className={`w-full h-10 border rounded-md px-3 py-2 ${
                err('study_end') ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {err('study_end') && <p className="mt-1 text-xs text-red-500">{errors.study_end}</p>}
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
                    max_members:
                      v.max_members && v.max_members >= 2
                        ? Math.min(30, Math.floor(v.max_members))
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
                  setValues((v) => ({ ...v, max_members: undefined }));
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
                  name="max_members"
                  value={values.max_members ?? ''}
                  onChange={setField('max_members')}
                  onBlur={onBlur('max_members')}
                  disabled={disabled}
                  className={`w-full border rounded-md px-3 py-2 ${
                    err('max_members') && errors.max_members ? 'border-red-400' : 'border-gray-300'
                  }`}
                  placeholder="최대 30명"
                />
                {err('max_members') && errors.max_members && (
                  <p className="mt-1 text-xs text-red-500">{errors.max_members}</p>
                )}
              </div>
            )}
          </div>
        </div>
      )}
      {isFree && (
        <div>
          <label className="block text-sm font-medium mb-2">
            이미지 업로드 (PNG/JPG · 최대 10장 · 총 10MB 이하)
          </label>
          <div
            {...getFreeRootProps()}
            className={`border-2 border-dashed rounded-md p-6 text-center cursor-pointer ${isFreeDrag ? 'border-black' : 'border-slate-300'}`}
          >
            <input {...getFreeInputProps()} />
            <p className="text-sm">
              이곳에 이미지를 드래그하거나 <span className="underline">클릭해서 선택</span>하세요.
            </p>
          </div>

          {(values.freeImages?.length ?? 0) > 0 && (
            <>
              <div className="mt-3 flex items-center justify-between text-sm">
                <span>
                  총 {values.freeImages!.length}장 · {bytesToMB(freeTotalSize)} MB
                </span>
                <button
                  type="button"
                  className="px-3 py-1 rounded-md border text-sm"
                  onClick={() => setValues((v) => ({ ...v, freeImages: [] }))}
                  disabled={disabled}
                >
                  모두 제거
                </button>
              </div>

              <div className="mt-2 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {values.freeImages!.map((f, idx) => (
                  <div key={`${f.name}-${f.size}-${idx}`} className="relative">
                    <img
                      src={URL.createObjectURL(f)}
                      alt={f.name}
                      className="w-full h-28 object-cover rounded border"
                    />
                    <button
                      type="button"
                      className="absolute top-1 right-1 px-2 py-0.5 text-xs bg-white/90 border rounded"
                      onClick={() =>
                        setValues((v) => ({
                          ...v,
                          freeImages: (v.freeImages ?? []).filter((_, i) => i !== idx),
                        }))
                      }
                      disabled={disabled}
                    >
                      제거
                    </button>
                    <div className="mt-1 text-[11px] text-slate-600 truncate">{f.name}</div>
                  </div>
                ))}
              </div>
            </>
          )}

          {err('freeLimit') && errors.freeLimit && (
            <p className="mt-2 text-xs text-red-500">{errors.freeLimit}</p>
          )}
        </div>
      )}
      {isShare && (
        <div>
          <label className="block text-sm font-medium mb-2">
            파일 업로드 (PNG/JPG/PDF/DOCX · 최대 10개 · 총 10MB 이하)
          </label>
          <div
            {...getShareRootProps()}
            className={`border-2 border-dashed rounded-md p-6 text-center cursor-pointer ${isShareDrag ? 'border-black' : 'border-slate-300'}`}
          >
            <input {...getShareInputProps()} />
            <p className="text-sm">
              이곳에 파일을 드래그하거나 <span className="underline">클릭해서 선택</span>하세요.
            </p>
          </div>

          {(values.shareFiles?.length ?? 0) > 0 && (
            <div className="mt-3 space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span>
                  총 {values.shareFiles!.length}개 · {bytesToMB(shareTotalSize)} MB
                </span>
                <button
                  type="button"
                  className="px-3 py-1 rounded-md border text-sm"
                  onClick={() => setValues((v) => ({ ...v, shareFiles: [] }))}
                  disabled={disabled}
                >
                  모두 제거
                </button>
              </div>

              <ul className="space-y-2">
                {values.shareFiles!.map((f, idx) => {
                  const isImg = f.type.startsWith('image/');
                  return (
                    <li
                      key={`${f.name}-${f.size}-${idx}`}
                      className="flex items-center gap-3 border rounded-md p-2"
                    >
                      {isImg ? (
                        <img
                          src={URL.createObjectURL(f)}
                          alt={f.name}
                          className="w-14 h-14 object-cover rounded border"
                        />
                      ) : (
                        <div className="w-14 h-14 rounded border flex items-center justify-center text-xs">
                          {f.type.includes('pdf') ? 'PDF' : 'DOCX'}
                        </div>
                      )}
                      <div className="text-sm min-w-0 flex-1">
                        <div className="font-medium truncate">{f.name}</div>
                        <div className="text-slate-500">{bytesToMB(f.size)} MB</div>
                      </div>
                      <button
                        type="button"
                        className="px-3 py-1 rounded-md border text-sm"
                        onClick={() =>
                          setValues((v) => ({
                            ...v,
                            shareFiles: (v.shareFiles ?? []).filter((_, i) => i !== idx),
                          }))
                        }
                        disabled={disabled}
                      >
                        제거
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
          )}

          {err('shareLimit') && errors.shareLimit && (
            <p className="mt-2 text-xs text-red-500">{errors.shareLimit}</p>
          )}
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
