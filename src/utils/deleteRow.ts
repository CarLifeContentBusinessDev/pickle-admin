import { supabase } from '../lib/supabase';

export async function deleteRow(table: string, id: number) {
  const confirmed = window.confirm('정말 삭제하시겠습니까?');
  if (!confirmed) return false;

  const { error } = await supabase.from(table).delete().eq('id', id);

  if (error) {
    alert('삭제 실패: ' + error.message);
    return false;
  }

  return true;
}
