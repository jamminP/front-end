import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { ActionId, StartCommand, Msg } from '../types/types';
import { ACTIONS } from '../constants/actions';

type GenerateReply = (input: string, action: ActionId | null) => Promise<string>;

export function useChat(externalCommand?: StartCommand | null, getReply?: GenerateReply) {
  const [view, setView] = useState<'home' | 'chat'>('home');
  const [selected, setSelected] = useState<ActionId | null>(null);
  const [messages, setMessages] = useState<Msg[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const uid = () => `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

  const selectedAction = useMemo(() => ACTIONS.find((a) => a.id === selected) ?? null, [selected]);

  const startChat = useCallback((id: ActionId) => {
    const a = ACTIONS.find((x) => x.id === id)!;
    setSelected(id);
    setView('chat');
    setMessages([{ id: uid(), role: 'assistant', text: a.firstPrompt, ts: Date.now() }]);
    requestAnimationFrame(() => inputRef.current?.focus());
  }, []);

  const backHome = useCallback(() => {
    setView('home');
    setSelected(null);
    setMessages([]);
  }, []);

  const appendAssistant = useCallback((text: string) => {
    setMessages((prev) => [...prev, { id: uid(), role: 'assistant', text, ts: Date.now() }]);
  }, []);

  const send = useCallback(async () => {
    const val = inputRef.current?.value?.trim();
    if (!val) return;

    const userMsg: Msg = { id: uid(), role: 'user', text: val, ts: Date.now() };
    setMessages((prev) => [...prev, userMsg]);
    if (inputRef.current) inputRef.current.value = '';

    const replyText = getReply
      ? await getReply(val, selected)
      : `좋아요! “${val}”에 대해 더 알려주시면 계획을 정교화할게요.`;

    appendAssistant(replyText);
  }, [getReply, selected, appendAssistant]);

  useEffect(() => {
    if (!externalCommand) return;
    if (externalCommand.type === 'start') startChat(externalCommand.actionId);
  }, [externalCommand?.token, startChat]);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (view !== 'chat') return;
      if (e.isComposing) return;
      const t = e.target as HTMLElement | null;
      const typing =
        !!t && (t.tagName === 'INPUT' || t.tagName === 'TEXTAREA' || t.isContentEditable);
      if (e.key === 'Enter' && !typing) {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [view]);

  return {
    view,
    selected,
    selectedAction,
    messages,
    inputRef,
    startChat,
    backHome,
    send,
    appendAssistant,
  };
}
