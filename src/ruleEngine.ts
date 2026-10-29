import { Student, Scholarship, RecommendationResult } from './types';

export function formatCurrency(amount: number): string {
  return '₹' + amount.toLocaleString('en-IN');
}

export function formatDate(dateStr: string): string {
  if (!dateStr) return 'N/A';
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return dateStr;
  return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
}

export function calculateScholarshipMatch(student: Student, scholarship: Scholarship): RecommendationResult {
  let score = 0;
  let isEligible = true;
  const breakdown: RecommendationResult['breakdown'] = {};

  // 1. Category Check (Weight: 20%)
  const reqCategory = (scholarship.category_required || 'ALL').trim();
  const studentCategory = (student.category || '').trim();

  if (reqCategory.toUpperCase() === 'ALL') {
    score += 20;
    breakdown['category'] = {
      status: true,
      label: 'Category',
      points: 20,
      reason: `Open to all categories (Student: ${studentCategory})`
    };
  } else {
    const allowed = reqCategory.split(',').map(s => s.trim());
    if (allowed.includes(studentCategory)) {
      score += 20;
      breakdown['category'] = {
        status: true,
        label: 'Category',
        points: 20,
        reason: `Matches required category: ${studentCategory}`
      };
    } else {
      isEligible = false;
      breakdown['category'] = {
        status: false,
        label: 'Category',
        points: 0,
        reason: `Requires ${reqCategory} (Student is ${studentCategory})`
      };
    }
  }

  // 2. Income Requirement (Weight: 20%)
  const maxIncome = Number(scholarship.max_income || 0);
  const studentIncome = Number(student.annual_income || 0);

  if (maxIncome <= 0) {
    score += 20;
    breakdown['income'] = {
      status: true,
      label: 'Annual Income',
      points: 20,
      reason: 'No income ceiling restriction'
    };
  } else {
    if (studentIncome <= maxIncome) {
      score += 20;
      breakdown['income'] = {
        status: true,
        label: 'Annual Income',
        points: 20,
        reason: `Income (${formatCurrency(studentIncome)}) within maximum limit (${formatCurrency(maxIncome)})`
      };
    } else {
      isEligible = false;
      breakdown['income'] = {
        status: false,
        label: 'Annual Income',
        points: 0,
        reason: `Income (${formatCurrency(studentIncome)}) exceeds ceiling (${formatCurrency(maxIncome)})`
      };
    }
  }

  // 3. Academic Marks (Weight: 20%)
  const minMarks = Number(scholarship.min_marks || 0);
  const studentMarks = Number(student.marks_percentage || 0);

  if (studentMarks >= minMarks) {
    score += 20;
    breakdown['marks'] = {
      status: true,
      label: 'Academic Marks',
      points: 20,
      reason: `Marks (${studentMarks}%) meet/exceed cutoff (${minMarks}%)`
    };
  } else if (studentMarks >= (minMarks - 5)) {
    score += 10;
    isEligible = false;
    breakdown['marks'] = {
      status: false,
      label: 'Academic Marks',
      points: 10,
      reason: `Marks (${studentMarks}%) slightly below minimum requirement (${minMarks}%)`
    };
  } else {
    isEligible = false;
    breakdown['marks'] = {
      status: false,
      label: 'Academic Marks',
      points: 0,
      reason: `Marks (${studentMarks}%) do not meet minimum cutoff (${minMarks}%)`
    };
  }

  // 4. Course Eligibility (Weight: 20%)
  const reqCourse = (scholarship.eligible_course || 'ALL').trim();
  const studentCourse = (student.course || '').trim();

  if (reqCourse.toUpperCase() === 'ALL') {
    score += 20;
    breakdown['course'] = {
      status: true,
      label: 'Course Stream',
      points: 20,
      reason: `Open to all academic streams (Student: ${studentCourse})`
    };
  } else {
    const allowedCourses = reqCourse.split(',').map(s => s.trim().toLowerCase());
    const courseMatched = allowedCourses.some(c => 
      c === studentCourse.toLowerCase() || 
      studentCourse.toLowerCase().includes(c) || 
      c.includes(studentCourse.toLowerCase())
    );

    if (courseMatched) {
      score += 20;
      breakdown['course'] = {
        status: true,
        label: 'Course Stream',
        points: 20,
        reason: `Eligible enrolled course: ${studentCourse}`
      };
    } else {
      isEligible = false;
      breakdown['course'] = {
        status: false,
        label: 'Course Stream',
        points: 0,
        reason: `Restricted to ${reqCourse} (Student in ${studentCourse})`
      };
    }
  }

  // 5. State Domicile (Weight: 20%)
  const reqState = (scholarship.state_applicable || 'ALL').trim();
  const studentState = (student.state || '').trim();

  if (reqState.toUpperCase() === 'ALL') {
    score += 20;
    breakdown['state'] = {
      status: true,
      label: 'State Domicile',
      points: 20,
      reason: `All-India eligibility (Student domicile: ${studentState})`
    };
  } else {
    if (reqState.toLowerCase() === studentState.toLowerCase()) {
      score += 20;
      breakdown['state'] = {
        status: true,
        label: 'State Domicile',
        points: 20,
        reason: `Domicile matched: ${studentState}`
      };
    } else {
      isEligible = false;
      breakdown['state'] = {
        status: false,
        label: 'State Domicile',
        points: 0,
        reason: `Applicable strictly for ${reqState} residents (Student: ${studentState})`
      };
    }
  }

  // Optional Gender Check
  const reqGender = (scholarship.gender_applicable || 'ALL').trim();
  const studentGender = (student.gender || '').trim();
  if (reqGender.toUpperCase() !== 'ALL' && reqGender) {
    if (reqGender.toLowerCase() !== studentGender.toLowerCase()) {
      isEligible = false;
      score = Math.max(0, score - 20);
      breakdown['gender'] = {
        status: false,
        label: 'Gender Requirement',
        points: 0,
        reason: `Scholarship exclusive to ${reqGender} candidates`
      };
    } else {
      breakdown['gender'] = {
        status: true,
        label: 'Gender Requirement',
        points: 0,
        reason: `Matches required gender: ${studentGender}`
      };
    }
  }

  let rankTier = 'Not Recommended';
  let badgeClass = 'badge-danger';
  if (score >= 90) {
    rankTier = 'High Match (Fully Eligible)';
    badgeClass = 'badge-success';
  } else if (score >= 70) {
    rankTier = 'Moderate Match';
    badgeClass = 'badge-warning';
  } else if (score >= 50) {
    rankTier = 'Low Match';
    badgeClass = 'badge-neutral';
  }

  return {
    match_score: score,
    is_eligible: isEligible,
    rank_tier: rankTier,
    badge_class: badgeClass,
    breakdown
  };
}
