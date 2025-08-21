export function toISOZ(d: Date) {
  // UTC Z로 직렬화
  return new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString();
}

function mkDateStrict(year: number, month1to12: number, day1to31: number): Date | null {
  const dt = new Date(year, month1to12 - 1, day1to31);
  if (dt.getFullYear() === year && dt.getMonth() === month1to12 - 1 && dt.getDate() === day1to31)
    return dt;
  return null;
}

export function parseDateRangeOrThrow(raw: string) {
  const s = raw.trim().replace(/\s+/g, ' ');
  const now = new Date();
  const THIS_YEAR = now.getFullYear();

  // Case #1 상대기간: "오늘부터 N일"
  {
    const m = s.match(/^(오늘|지금)\s*부터\s*(\d{1,3})\s*일$/);
    if (m) {
      const n = Number(m[2]);
      const start = new Date();
      const end = new Date();
      end.setDate(start.getDate() + n);
      return { start: toISOZ(start), end: toISOZ(end) };
    }
  }

  // Case #2 한글 자연어: "5월 18일부터 30일까지"
  {
    const m = s.match(/^(\d{1,2})\s*월\s*(\d{1,2})\s*일\s*부터\s*(\d{1,2})\s*일\s*(?:까지)?$/);
    if (m) {
      const sm = Number(m[1]),
        sd = Number(m[2]),
        ed = Number(m[3]);
      const start = mkDateStrict(THIS_YEAR, sm, sd);
      const end = mkDateStrict(THIS_YEAR, sm, ed);
      if (!start || !end || end <= start) throw new Error('기간 형식이 올바르지 않아요.');
      return { start: toISOZ(start), end: toISOZ(end) };
    }
  }

  // Case #3 한글 자연어: "5월 18일부터 6월 20일까지"
  {
    const m = s.match(
      /^(\d{1,2})\s*월\s*(\d{1,2})\s*일\s*부터\s*(\d{1,2})\s*월\s*(\d{1,2})\s*일\s*(?:까지)?$/,
    );
    if (m) {
      const sm = Number(m[1]),
        sd = Number(m[2]),
        em = Number(m[3]),
        ed = Number(m[4]);
      let sy = THIS_YEAR,
        ey = THIS_YEAR;
      let start = mkDateStrict(sy, sm, sd);
      let end = mkDateStrict(ey, em, ed);
      if (!start || !end) throw new Error('존재하지 않는 날짜예요.');

      // 연도 명시가 없고, 종료가 시작보다 앞이면 → 다음 해로 보정(연말~연초 구간 허용)
      if (end <= start) {
        ey = sy + 1;
        end = mkDateStrict(ey, em, ed);
      }
      if (!end || end <= start) throw new Error('기간 형식이 올바르지 않아요.');
      return { start: toISOZ(start), end: toISOZ(end) };
    }
  }

  // Case #4 슬래시/점/대시: "M/D ~ M/D" (연도 생략)
  {
    const m = s.match(/^(\d{1,2})[./-](\d{1,2})\s*[~\-–—]\s*(\d{1,2})[./-](\d{1,2})$/);
    if (m) {
      const sm = Number(m[1]),
        sd = Number(m[2]),
        em = Number(m[3]),
        ed = Number(m[4]);
      let sy = THIS_YEAR,
        ey = THIS_YEAR;
      let start = mkDateStrict(sy, sm, sd);
      let end = mkDateStrict(ey, em, ed);
      if (!start || !end) throw new Error('존재하지 않는 날짜예요.');

      if (end <= start) {
        ey = sy + 1;
        end = mkDateStrict(ey, em, ed);
      }
      if (!end || end <= start) throw new Error('기간 형식이 올바르지 않아요.');
      return { start: toISOZ(start), end: toISOZ(end) };
    }
  }

  // Case #5 첫쪽에 연도, 두번째는 연도 생략: "2025-5-18 ~ 6-20"
  {
    const m = s.match(/^(\d{4})[./-](\d{1,2})[./-](\d{1,2})\s*[~\-–—]\s*(\d{1,2})[./-](\d{1,2})$/);
    if (m) {
      const sy = Number(m[1]),
        sm = Number(m[2]),
        sd = Number(m[3]);
      let ey = sy,
        em = Number(m[4]),
        ed = Number(m[5]);
      const start = mkDateStrict(sy, sm, sd);
      let end = mkDateStrict(ey, em, ed);
      if (!start || !end) throw new Error('존재하지 않는 날짜예요.');
      if (end <= start) {
        ey = sy + 1;
        end = mkDateStrict(ey, em, ed);
      }
      if (!end || end <= start) throw new Error('기간 형식이 올바르지 않아요.');
      return { start: toISOZ(start), end: toISOZ(end) };
    }
  }

  // Case #6 ISO 스타일(양쪽 연도): "YYYY-MM-DD ~ YYYY-MM-DD"
  {
    const m = s.match(
      /^(\d{4})[./-](\d{1,2})[./-](\d{1,2})\s*[~\-–—]\s*(\d{4})[./-](\d{1,2})[./-](\d{1,2})$/,
    );
    if (m) {
      const sy = Number(m[1]),
        sm = Number(m[2]),
        sd = Number(m[3]);
      const ey = Number(m[4]),
        em = Number(m[5]),
        ed = Number(m[6]);
      const start = mkDateStrict(sy, sm, sd);
      const end = mkDateStrict(ey, em, ed);
      if (!start || !end || end <= start) throw new Error('기간 형식이 올바르지 않아요.');
      return { start: toISOZ(start), end: toISOZ(end) };
    }
  }

  // Case #7 틸다 없이 공백/쉼표로 구분: "5/18 6/20" 또는 "5.18, 6.20"
  {
    const m = s.match(/^(\d{1,2})[./-](\d{1,2})[\s,]+(\d{1,2})[./-](\d{1,2})$/);
    if (m) {
      const sm = Number(m[1]),
        sd = Number(m[2]),
        em = Number(m[3]),
        ed = Number(m[4]);
      let sy = THIS_YEAR,
        ey = THIS_YEAR;
      let start = mkDateStrict(sy, sm, sd);
      let end = mkDateStrict(ey, em, ed);
      if (!start || !end) throw new Error('존재하지 않는 날짜예요.');
      if (end <= start) {
        ey = sy + 1;
        end = mkDateStrict(ey, em, ed);
      }
      if (!end || end <= start) throw new Error('기간 형식이 올바르지 않아요.');
      return { start: toISOZ(start), end: toISOZ(end) };
    }
  }

  // Error message
  throw new Error(
    '날짜 형식을 이해하지 못했어요. 예) "2025-08-13 ~ 2025-09-14", "5/18 ~ 6/20", "5월 18일부터 30일까지", "오늘부터 28일"',
  );
}
