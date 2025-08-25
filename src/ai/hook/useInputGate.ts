import { useCallback, useMemo, useState } from 'react';
import type { RefObject, ChangeEvent, KeyboardEvent } from 'react';
import { countCoreChars } from '../utils/char';

export type Validator = (text: string) => string | null;

export const minLen =
  (n: number): Validator =>
  (text) =>
    countCoreChars(text) < n ? `최소 ${n}자 이상 입력해 주세요.` : null;

export const notMeaningless: Validator = (text) => {
  const t = (text || '').trim();
  if (!t) return '내용이 비어 있습니다.';

  if (/(.{1,3})\1{3,}/.test(t)) {
    return '반복적인 문자열로 보입니다.';
  }

  const core = t.replace(/[^A-Za-z0-9\uAC00-\uD7A3\u3131-\u318E\u1100-\u11FF]+/g, '');
  if (!core) return null;

  const seen: Record<string, true> = {};
  let uniq = 0;
  for (let i = 0; i < core.length; i++) {
    const ch = core.charAt(i);
    if (!seen[ch]) {
      seen[ch] = true;
      uniq++;
    }
  }
  const ratio = uniq / core.length;
  return ratio < 0.25 ? '문자 다양성이 매우 낮습니다.' : null;
};

type Elem = HTMLInputElement | HTMLTextAreaElement;

type Opts<E extends Elem> = {
  inputRef: RefObject<E | null>;
  onSend: () => void;
  validators?: Validator[];
};

export function useInputGate<E extends Elem>({ inputRef, onSend, validators = [] }: Opts<E>) {
  const [value, setValue] = useState('');

  const reasons = useMemo(() => {
    const v = value;
    return validators.map((fn) => fn(v)).filter(Boolean) as string[];
  }, [value, validators]);

  const canSend = reasons.length === 0;

  const onChange = useCallback((e: ChangeEvent<E>) => {
    setValue(e.currentTarget.value);
  }, []);

  const trySend = useCallback(() => {
    if (!canSend) return;
    onSend();
    setValue('');
    if (inputRef.current) inputRef.current.value = '';
  }, [canSend, onSend, inputRef]);

  const onKeyDown = useCallback(
    (e: KeyboardEvent<E>) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        trySend();
      }
    },
    [trySend],
  );

  return { value, setValue, reasons, canSend, onChange, onKeyDown, trySend };
}
