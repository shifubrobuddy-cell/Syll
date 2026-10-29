<?php
/**
 * SCHOLARSHIP RECOMMENDATION SYSTEM
 * Shared Footer Component
 * File: includes/footer.php
 */
$bUrl = isset($baseUrl) ? $baseUrl : '';
?>
<footer style="background-color: var(--primary-dark); color: var(--text-on-dark); border-top: 1px solid rgba(255,255,255,0.08); margin-top: auto; padding: 3.5rem 0 2rem;">
    <div class="container">
        <div class="grid grid-4" style="gap: 2.5rem; margin-bottom: 2.5rem;">
            <!-- Column 1: Brand & Purpose -->
            <div style="grid-column: span 1.5;">
                <div style="display: flex; align-items: center; gap: 0.65rem; margin-bottom: 1rem;">
                    <div style="width: 34px; height: 34px; background-color: var(--accent); color: var(--primary-dark); border-radius: var(--radius-sm); display: flex; align-items: center; justify-content: center; font-family: var(--font-heading); font-size: 1.15rem; font-weight: 700;">
                        S
                    </div>
                    <div style="font-family: var(--font-heading); font-size: 1.15rem; font-weight: 700; color: #FFFFFF;">
                        Scholarship Recommendation System
                    </div>
                </div>
                <p style="color: #94A3B8; font-size: 0.875rem; line-height: 1.6;">
                    A rule-based educational platform designed to empower students with transparent, automated eligibility evaluation and centralized opportunity tracking.
                </p>
            </div>

            <!-- Column 2: Quick Links -->
            <div>
                <h6 style="color: var(--accent); margin-bottom: 1rem; text-transform: uppercase; font-size: 0.75rem; letter-spacing: 0.1em;">Platform</h6>
                <ul style="list-style: none; display: flex; flex-direction: column; gap: 0.6rem; font-size: 0.875rem;">
                    <li><a href="<?= $bUrl ?>student/scholarships.php" style="color: #CBD5E1;">Browse Catalog</a></li>
                    <li><a href="<?= $bUrl ?>index.php#how-it-works" style="color: #CBD5E1;">Recommendation Engine</a></li>
                    <li><a href="<?= $bUrl ?>student/dashboard.php" style="color: #CBD5E1;">Student Command Center</a></li>
                </ul>
            </div>

            <!-- Column 3: Institutional & Security -->
            <div>
                <h6 style="color: var(--accent); margin-bottom: 1rem; text-transform: uppercase; font-size: 0.75rem; letter-spacing: 0.1em;">Governance</h6>
                <ul style="list-style: none; display: flex; flex-direction: column; gap: 0.6rem; font-size: 0.875rem;">
                    <li><a href="<?= $bUrl ?>login.php" style="color: #CBD5E1;">Administrative Portal</a></li>
                    <li><span style="color: #94A3B8;">Direct Rule Matching</span></li>
                    <li><span style="color: #94A3B8;">Verified Document Audit</span></li>
                </ul>
            </div>

            <!-- Column 4: Architecture Badges -->
            <div>
                <h6 style="color: var(--accent); margin-bottom: 1rem; text-transform: uppercase; font-size: 0.75rem; letter-spacing: 0.1em;">Technology Stack</h6>
                <div style="display: flex; flex-direction: column; gap: 0.4rem; font-size: 0.8125rem; color: #94A3B8;">
                    <div>• PHP 8.x + PDO Architecture</div>
                    <div>• MySQL 8.x Relational Engine</div>
                    <div>• Native Semantic HTML5 / CSS3</div>
                    <div>• Zero Frontend Frameworks</div>
                </div>
            </div>
        </div>

        <div style="border-top: 1px solid rgba(255,255,255,0.08); padding-top: 1.5rem; display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 1rem; font-size: 0.8125rem; color: #94A3B8;">
            <div>&copy; <?= date('Y') ?> Scholarship Recommendation System. All rights reserved.</div>
            <div>Institutional Academic Capstone Project</div>
        </div>
    </div>
</footer>

<!-- Vanilla JS Scripts -->
<script src="<?= $bUrl ?>assets/js/main.js"></script>
<script src="<?= $bUrl ?>assets/js/auth.js"></script>
<script src="<?= $bUrl ?>assets/js/recommendations.js"></script>
<script src="<?= $bUrl ?>assets/js/applications.js"></script>
<script src="<?= $bUrl ?>assets/js/admin.js"></script>
</body>
</html>
