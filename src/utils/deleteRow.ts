import { supabase } from '../lib/supabase';

export async function deleteRow(table: string, id: number) {
  const confirmed = window.confirm('정말 삭제하시겠습니까?');
  if (!confirmed) return false;

  // 시리즈/테마는 조인 테이블 매핑을 먼저 지워야 FK/RLS 충돌을 피할 수 있습니다.
  if (table === 'series') {
    const { error: mappingError } = await supabase
      .from('series_episodes')
      .delete()
      .eq('series_id', id);

    if (mappingError) {
      alert('매핑 삭제 실패: ' + mappingError.message);
      return false;
    }
  }

  if (table === 'themes') {
    const { error: mappingError } = await supabase
      .from('themes_programs')
      .delete()
      .eq('theme_id', id);

    if (mappingError) {
      alert('매핑 삭제 실패: ' + mappingError.message);
      return false;
    }
  }

  const { error } = await supabase.from(table).delete().eq('id', id);

  if (error) {
    const isRlsError =
      error.message.toLowerCase().includes('row-level security') ||
      error.message.toLowerCase().includes('rls');

    if (isRlsError) {
      alert(
        `삭제 실패: ${error.message}\n\nSupabase RLS DELETE 정책이 필요합니다. ${table} 테이블에 authenticated 대상 DELETE policy를 추가해주세요.`
      );
    } else {
      alert('삭제 실패: ' + error.message);
    }
    return false;
  }

  return true;
}
