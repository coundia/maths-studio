import { CourseChapter } from '../coursesData';

export type GradeLevel = '6e' | '5e' | '4e' | '3e';

/**
 * Determine un chapitre "classe" a partir de son champ `gradeLevel` explicite,
 * ou (pour les chapitres historiques qui n'avaient pas ce champ) a partir de
 * la convention de nommage de son id : suffixe `-6e` / `-5e` / `-3e`, ou
 * prefixe `video-` (videos BFEM, classees en 3e). Sans indice reconnu, on
 * retombe sur 4e : c'est ainsi qu'a ete redige le catalogue 4e d'origine,
 * qui n'a jamais porte de suffixe.
 *
 * Point d'entree unique pour cette classification : toute logique qui teste
 * "ce chapitre est-il un 3e / un 5e / ..." doit passer par cette fonction,
 * pour eviter qu'un nouveau niveau (ajoute plus tard) ne soit mal classe par
 * un `!is3e && !is5e` qui l'oublierait silencieusement.
 */
export function getGradeLevel(chapter: Pick<CourseChapter, 'id' | 'gradeLevel'>): GradeLevel {
  if (chapter.gradeLevel) return chapter.gradeLevel;
  if (chapter.id.endsWith('-6e')) return '6e';
  if (chapter.id.endsWith('-3e') || chapter.id.startsWith('video-')) return '3e';
  if (chapter.id.endsWith('-5e')) return '5e';
  return '4e';
}

/** Libelle long, pour les titres et menus ("Classe de 6ème"). */
export const GRADE_LABEL: Record<GradeLevel, string> = {
  '6e': '6ème',
  '5e': '5ème',
  '4e': '4ème',
  '3e': '3ème BFEM',
};

/** Libelle court, pour les badges compacts ("6e", "3e BFEM"). */
export const GRADE_BADGE: Record<GradeLevel, string> = {
  '6e': '6e',
  '5e': '5e',
  '4e': '4e',
  '3e': '3e BFEM',
};
