/**
 * Academic Pathway Recommendation Engine
 *
 * Deterministic rules-based engine that scores a user profile across three
 * dimensions — academic level, professional maturity, and goal alignment —
 * then maps to one of four pathways with a human-readable explanation.
 *
 * Pathways:
 *   1. Certification Program  — skill-building, early-career, career-switchers
 *   2. DBA                    — experienced professionals, industry leadership
 *   3. PhD                    — research-oriented, academic careers
 *   4. Honorary Doctorate     — exceptional senior leaders, transformative impact
 */

/* ─── Keyword Banks ─── */

const RESEARCH_KEYWORDS = [
  'research', 'academia', 'academic', 'publish', 'professor', 'faculty',
  'scholar', 'thesis', 'dissertation', 'scientist', 'laboratory', 'lab',
  'journal', 'peer-review', 'postdoc', 'tenure', 'teaching', 'university',
  'lecture', 'theory', 'innovation', 'study', 'investigate',
];

const LEADERSHIP_KEYWORDS = [
  'leadership', 'management', 'manager', 'business', 'executive', 'strategy',
  'director', 'ceo', 'cfo', 'cto', 'coo', 'vp', 'vice president', 'founder',
  'entrepreneur', 'startup', 'consulting', 'consultant', 'administration',
  'corporate', 'enterprise', 'mba', 'growth', 'operations', 'revenue',
  'stakeholder', 'c-suite', 'board', 'governance',
];

const IMPACT_KEYWORDS = [
  'impact', 'philanthropy', 'legacy', 'transform', 'humanitarian',
  'global', 'influence', 'thought leader', 'visionary', 'pioneer',
  'lifetime', 'distinguished', 'eminent', 'award', 'recognition',
  'contribution', 'mentorship', 'society', 'community', 'nonprofit',
  'policy', 'reform', 'advocacy',
];

const SENIOR_PROFESSION_KEYWORDS = [
  'ceo', 'cto', 'cfo', 'coo', 'director', 'vp', 'vice president',
  'president', 'founder', 'co-founder', 'partner', 'principal',
  'chief', 'head of', 'senior', 'executive', 'board member',
  'chancellor', 'dean', 'provost',
];

/* ─── Scoring Helpers ─── */

function getAcademicScore(qualification) {
  const map = {
    'High School': 1,
    'Diploma': 2,
    "Bachelor's Degree": 3,
    "Master's Degree": 4,
    'PhD / Doctorate': 5,
    'Other': 2,
  };
  return map[qualification] ?? 2;
}

function getProfessionalScore(experience, profession) {
  let score;
  if (experience <= 2) score = 1;
  else if (experience <= 5) score = 2;
  else if (experience <= 10) score = 3;
  else if (experience <= 20) score = 4;
  else score = 5;

  const profLower = profession.toLowerCase();
  if (SENIOR_PROFESSION_KEYWORDS.some((kw) => profLower.includes(kw))) {
    score = Math.min(score + 1, 6);
  }

  return score;
}

function countKeywordMatches(text, keywords) {
  const lower = text.toLowerCase();
  return keywords.filter((kw) => lower.includes(kw)).length;
}

/* ─── Main Engine ─── */

/**
 * Generate a pathway recommendation from user profile data.
 *
 * @param {{ qualification: string, experience: number, profession: string, careerGoal: string }} profile
 * @returns {{ recommendation: string, reason: string }}
 */
export function generateRecommendation({ qualification, experience, profession, careerGoal }) {
  const academic = getAcademicScore(qualification);
  const professional = getProfessionalScore(experience, profession);

  const combinedText = `${profession} ${careerGoal}`;
  const researchScore = countKeywordMatches(combinedText, RESEARCH_KEYWORDS);
  const leadershipScore = countKeywordMatches(combinedText, LEADERSHIP_KEYWORDS);
  const impactScore = countKeywordMatches(combinedText, IMPACT_KEYWORDS);

  // ── Honorary Doctorate ──
  // Exceptional profiles: very senior, highly educated, impact-driven
  if (
    professional >= 5 &&
    academic >= 4 &&
    impactScore >= 2
  ) {
    return {
      recommendation: 'Honorary Doctorate',
      reason:
        `With ${experience}+ years of professional experience at the ${profession} level and a strong ` +
        `${qualification} foundation, your profile reflects exceptional career achievement. Your goal ` +
        `of "${careerGoal}" aligns with transformative impact — an Honorary Doctorate would formally ` +
        `recognize your distinguished contributions to your field and society.`,
    };
  }

  // Also consider very high experience + impact even with lower academics
  if (professional >= 5 && experience >= 25 && impactScore >= 1 && academic >= 3) {
    return {
      recommendation: 'Honorary Doctorate',
      reason:
        `Your ${experience} years of experience and role as ${profession} represent a career of ` +
        `extraordinary depth. Combined with your aspiration toward "${careerGoal}", an Honorary ` +
        `Doctorate would be a fitting recognition of your lifetime contributions and leadership legacy.`,
    };
  }

  // ── PhD ──
  // Research-oriented, strong academic background
  if (researchScore >= 2 && academic >= 3) {
    return {
      recommendation: 'PhD',
      reason:
        `Your ${qualification} background provides a solid academic foundation, and your interest ` +
        `in "${careerGoal}" shows clear research and academic orientation. A PhD program would ` +
        `enable you to contribute original knowledge to your field, pursue faculty positions, and ` +
        `establish yourself as a subject-matter expert.`,
    };
  }

  if (academic >= 4 && researchScore >= 1 && leadershipScore === 0) {
    return {
      recommendation: 'PhD',
      reason:
        `Holding a ${qualification} and with ${experience} years of experience, your profile is ` +
        `academically strong. Your career goal of "${careerGoal}" suggests a scholarly trajectory. ` +
        `A PhD would deepen your expertise through rigorous research and open doors to academic ` +
        `and high-level research careers.`,
    };
  }

  // ── DBA ──
  // Experienced professionals with leadership/business orientation
  if (leadershipScore >= 2 && professional >= 3 && academic >= 3) {
    return {
      recommendation: 'DBA',
      reason:
        `With ${experience} years of experience as ${profession} and a ${qualification}, you have ` +
        `a strong professional profile. Your ambition toward "${careerGoal}" aligns with strategic ` +
        `business leadership. A DBA (Doctor of Business Administration) would equip you with ` +
        `advanced applied-research skills to drive organizational and industry-level impact.`,
    };
  }

  if (professional >= 4 && academic >= 3 && leadershipScore >= 1) {
    return {
      recommendation: 'DBA',
      reason:
        `Your ${experience} years in your field and current role as ${profession} demonstrate ` +
        `significant industry expertise. Paired with your goal of "${careerGoal}", a DBA would ` +
        `bridge your practical experience with doctoral-level research, positioning you for ` +
        `executive thought leadership and senior consulting roles.`,
    };
  }

  // Edge case: very high experience + leadership goal but lower education
  if (professional >= 4 && experience >= 12 && leadershipScore >= 1) {
    return {
      recommendation: 'DBA',
      reason:
        `With ${experience} years of hands-on experience as ${profession}, you bring deep industry ` +
        `knowledge. Your goal of "${careerGoal}" points toward business leadership. A DBA program ` +
        `would formalize your expertise through applied doctoral research, enhancing your credibility ` +
        `for C-suite, board, and advisory roles.`,
    };
  }

  // ── Certification Program (Default) ──
  // Early career, career changers, skill builders, or unmatched profiles
  let certReason;
  if (experience <= 3) {
    certReason =
      `As an early-career professional with ${experience} year(s) of experience and a ${qualification}, ` +
      `a Certification Program is the most practical next step. It will help you build targeted skills ` +
      `toward your goal of "${careerGoal}", strengthen your resume, and accelerate your career ` +
      `trajectory without the multi-year commitment of a full degree program.`;
  } else if (academic <= 2) {
    certReason =
      `With your current ${qualification} and ${experience} years as ${profession}, a focused ` +
      `Certification Program will efficiently upgrade your credentials. It aligns well with your ` +
      `goal of "${careerGoal}" by providing industry-recognized skills that employers and clients ` +
      `value — a practical investment with quick returns.`;
  } else {
    certReason =
      `Given your profile as ${profession} with a ${qualification} and ${experience} years of ` +
      `experience, a Certification Program offers the best balance of time investment and career ` +
      `impact. It will sharpen specialized skills relevant to "${careerGoal}" and keep you ` +
      `competitive in a rapidly evolving professional landscape.`;
  }

  return {
    recommendation: 'Certification Program',
    reason: certReason,
  };
}
