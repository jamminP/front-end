import { useEffect, useMemo, useState } from "react";


export type PostFormValues = {
    title: string;
    content: string;
    category: "free" | "share" | "study"
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
    title: "",
    content: "",
    category: "free",
};

type Errors = Partial<Record<keyof PostFormValues, string>>;

function validate(values: PostFormValues): Errors {
    const e: Errors = {};
    const req = (v?: string) => v && v.trim().length > 0;

    if (!req(values.title)) e.title = "제목은 필수입니다.";
    if (!req(values.content)) e.content = "내용은 필수입니다.";

    if (values.category === "study") {
        const RS = values.recruitStart ?? "";
        const RE = values.recruitEnd ?? "";
        const SS = values.studyStart ?? "";
        const SE = values.studyEnd ?? "";

        if (RS && RE && RS > RE) e.recruitEnd = "모집 마감은 시작 이후여햐 합니다.";
        if (SS && SE && SS > SE) e.studyEnd = "스터디 종료는 시작 이후여햐 합니다.";

        if (values.maxMembers !== undefined) {
            if (Number.isNaN(values.maxMembers) || values.maxMembers < 2) {
                e.maxMembers = "최대 인원은 2명 이상이어야 합니다.";
            }
        }
    }

    return e;
}

export default function PostForm({
    initialValues,
    submitLabel = "등록",
    onSubmit,
    disabled,
}: PostFormProps) {
    const [values, setValues] = useState<PostFormValues>({
        ...defaults,
        ...initialValues,
    });
    const [touched, setTouched] = useState<Record<string, boolean>>({});

    useEffect(() => {
        setValues((prev => ({ ...prev, ...initialValues})));
    }, [initialValues]);

    const isStudy = values.category === "study";
    const errors = useMemo(() => validate(values), [values]);
    const hasError = Object.keys(errors).length > 0;

    const setField =
    (name: keyof PostFormValues) => (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement> => {
            const raw = e.target.value;
            setValues((v) => ({
                ...v,
                [name]: name === "maxMembers" ? (raw === "" ? undefined : Number(raw)) : raw,
            }));
        };
        const onBlur =
        (name: keyof PostFormValues) => () => setTouched((t)=> ({ ...t, [name]: true}));

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
            });
            if (hasError) return;
            onSubmit(values);
        };
        const err = (k: keyof PostFormValues) => touched[k];

        return (
            <form onSubmit = {handleSubmit}>
                <div>
                    <label>제목</label>
                    <input
                        name="title"
                        value={values.title}
                        onChange={setField("title")}
                        onBlur={onBlur("title")}
                        placeholder="제목을 입력하세요"
                        disabled={disabled}
                    />
                    {err("title") && <p>{errors.title}</p>}
                </div>
                <div>
                    <label>카테고리</label>
                    <select
                        name="categort"
                        value={values.category}
                        onChange={setField("category")}
                        onBlur={onBlur("category")}
                        disabled={disabled}>
                            <option value="free">자유</option>
                            <option value="share">자료 공유</option>
                            <option value="study">스터디</option>
                    </select>
                </div>

                <div>
                    <textarea
                        name="content"
                        value={values.content}
                        onChange={setField("content")}
                        onBlur={onBlur("content")}
                        placeholder="내용을 입력하세요"
                        disabled={disabled}/>
                    {err("content") && <p>{errors.content}</p>}
                </div>
                {isStudy && (
                    <div>
                        <div>
                            <label>모집 시작일</label>
                            <input
                                type="date"
                                name="recruitStard"
                                value={values.recruitStart ?? ""}
                                onChange={setField("recruitStart")}
                                onBlur={onBlur("recruitStart")}
                                disabled={disabled}
                                />
                        </div>
                        <div>
                            <label>모집 마감일</label>
                            <input
                                type="date"
                                name="recruitEnd"
                                value={values.recruitEnd ?? ""}
                                onChange={setField("recruitEnd")}
                                onBlur={onBlur("recruitEnd")}
                                disabled={disabled}
                                />
                                {err("recruitEnd") && (
                                    <p>{errors.recruitEnd}</p>
                                )}
                        </div>
                        <div>
                            <label>스터디 시작일</label>
                            <input
                                type="date"
                                name="studyStart"
                                value={values.studyStart ?? ""}
                                onChange={setField("studyStart")}
                                onBlur={onBlur("studyStart")}
                                disabled={disabled}
                            />
                        </div>
                        <div>
                            <label>스터디 종료일</label>
                            <input
                                type="date"
                                name="studyEnd"
                                value={values.studyEnd ?? ""}
                                onChange={setField("studyEnd")}
                                disabled={disabled}
                            />
                            {err("studyEnd") && (
                                <p>{errors.studyEnd}</p>
                            )}
                        </div>
                        <div>
                            <label>최대 인원</label>
                            <input
                                type="number"
                                min={2}
                                name="maxMembers"
                                value={values.maxMembers ?? ""}
                                onChange={setField("maxMembers")}
                                onBlur={onBlur("maxMembers")}
                                disabled={disabled}
                            />
                            {err("maxMembers") && (
                                <p>{errors.maxMembers}</p>
                            )}
                        </div>
                    </div>
                )}
                <div>
                    <button
                        type="submit"
                        disabled={disabled}
                        >
                        {submitLabel}
                    </button>
                </div>
            </form>
        )
    )
}