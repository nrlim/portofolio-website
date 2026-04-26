
import React from 'react';
import { personalInfo, about, skills, experience, projects, education, certifications, interests } from '@/data/portfolio';

export const CVTemplate = React.forwardRef<HTMLDivElement, object>((props, ref) => {
    // Helper styles for common patterns
    const styles = {
        page: {
            backgroundColor: '#ffffff',
            color: '#000000',
            width: '210mm',
            // Remove fixed height to allow expansion
            minHeight: '297mm',
            margin: '0 auto',
            padding: '10mm', // standard padding
            boxSizing: 'border-box' as const,
            fontFamily: 'sans-serif', // Fallback font
            lineHeight: '1.5',
            fontSize: '10pt', // Base size
        },
        header: {
            borderBottom: '2px solid #111827',
            paddingBottom: '1.5rem',
            marginBottom: '2rem',
        },
        flexBetweenEnd: {
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-end',
        },
        h1: {
            fontSize: '2.25rem', // 4xl
            fontWeight: 'bold',
            textTransform: 'uppercase' as const,
            letterSpacing: '-0.025em',
            margin: '0 0 0.5rem 0',
            color: '#111827',
            lineHeight: '1',
        },
        h2: {
            fontSize: '1.25rem', // xl
            fontWeight: '500',
            letterSpacing: '0.025em',
            color: '#374151',
            margin: 0,
        },
        contactBlock: {
            textAlign: 'right' as const,
            fontSize: '0.875rem', // sm
            color: '#4b5563',
        },
        contactItem: {
            margin: '0.25rem 0',
        },
        link: {
            color: '#2563eb',
            textDecoration: 'underline',
        },
        gridContainer: {
            display: 'grid',
            gridTemplateColumns: 'repeat(12, 1fr)',
            gap: '2rem',
        },
        leftColumn: {
            gridColumn: 'span 8',
        },
        rightColumn: {
            gridColumn: 'span 4',
        },
        section: {
            marginBottom: '2rem',
        },
        sectionTitle: {
            fontSize: '1.125rem', // lg
            fontWeight: 'bold',
            textTransform: 'uppercase' as const,
            letterSpacing: '0.05em',
            color: '#111827',
            borderBottom: '1px solid #d1d5db',
            marginBottom: '1rem',
            paddingBottom: '0.25rem',
        },
        textJustify: {
            textAlign: 'justify' as const,
            color: '#374151',
            fontSize: '0.875rem',
            marginTop: '0.25rem',
        },
        badgeContainer: {
            display: 'flex',
            flexWrap: 'wrap' as const,
            gap: '0.5rem',
            marginTop: '1rem',
        },
        badge: {
            display: 'inline-flex',
            alignItems: 'center',
            padding: '0.125rem 0.625rem',
            borderRadius: '9999px',
            fontSize: '0.75rem',
            fontWeight: '500',
            backgroundColor: '#f3f4f6',
            color: '#1f2937',
            border: '1px solid #e5e7eb',
        },
        experienceItem: {
            marginBottom: '1rem', // Reduced from 1.5rem
        },
        jobHeader: {
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'baseline',
            marginBottom: '0.15rem', // Reduced
        },
        jobTitle: {
            fontSize: '1rem',
            fontWeight: 'bold',
            color: '#111827',
            margin: 0,
        },
        periodBadge: {
            fontSize: '0.75rem',
            fontWeight: '600',
            color: '#6b7280',
            backgroundColor: '#f9fafb',
            padding: '0.25rem 0.5rem',
            borderRadius: '0.25rem',
            border: '1px solid #f3f4f6',
            whiteSpace: 'nowrap' as const,
        },
        companyLoc: {
            fontSize: '0.875rem',
            fontWeight: '600',
            color: '#374151',
            marginBottom: '0.5rem',
            fontStyle: 'italic',
            fontFamily: 'serif',
        },
        list: {
            listStyleType: 'disc',
            listStylePosition: 'outside' as const,
            marginLeft: '1rem',
            fontSize: '0.875rem',
            color: '#4b5563',
            margin: '0 0 1rem 1rem',
            paddingLeft: '0.5rem',
        },
        listItem: {
            marginBottom: '0.25rem',
            paddingLeft: '0.25rem',
        },
        narrative: {
            fontSize: '0.875rem',
            color: '#374151',
            fontStyle: 'italic',
            lineHeight: '1.6',
            marginTop: '0.75rem',
            backgroundColor: '#f9fafb',
            padding: '0.75rem',
            borderRadius: '0.375rem',
            borderLeft: '3px solid #e5e7eb'
        },
        projectItem: {
            marginBottom: '2rem',
            pageBreakInside: 'avoid' as const,
        },
        projectHeader: {
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'baseline',
            marginBottom: '0.25rem',
        },
        projectTitle: {
            fontWeight: 'bold',
            fontSize: '1rem',
            color: '#111827',
            margin: 0,
        },
        projectCat: {
            fontSize: '10px',
            textTransform: 'uppercase' as const,
            fontWeight: 'bold',
            letterSpacing: '0.025em',
            color: '#6b7280',
        },
        projectTech: {
            fontSize: '0.75rem',
            color: '#2563eb',
            marginBottom: '0.5rem',
            fontWeight: '500',
            marginTop: 0,
        },
        projectDesc: {
            fontSize: '0.875rem',
            color: '#1f2937',
            lineHeight: '1.5',
            margin: '0 0 0.75rem 0',
        },
        caseStudy: {
            backgroundColor: '#f8fafc',
            border: '1px solid #e2e8f0',
            borderRadius: '0.5rem',
            padding: '0.75rem',
            fontSize: '0.8rem',
            marginTop: '0.5rem',
        },
        caseRow: {
            marginBottom: '0.75rem',
        },
        caseLabel: {
            fontWeight: 'bold',
            color: '#0f172a',
            display: 'block',
            marginBottom: '0.125rem',
            fontSize: '0.75rem',
            textTransform: 'uppercase' as const,
            letterSpacing: '0.05em',
        },
        caseText: {
            color: '#334155',
            lineHeight: '1.5',
        },
        skillGroup: {
            marginBottom: '1rem',
        },
        skillTitle: {
            fontSize: '0.75rem',
            fontWeight: 'bold',
            textTransform: 'uppercase' as const,
            color: '#6b7280',
            marginBottom: '0.25rem',
            margin: 0,
        },
        skillList: {
            fontSize: '0.875rem',
            color: '#1f2937',
            lineHeight: '1.375',
            margin: 0,
        },
        eduItem: {
            marginBottom: '1rem',
        },
        certItem: {
            marginBottom: '0.75rem',
            display: 'flex',
            flexDirection: 'column' as const,
        },
        interestGroup: {
            display: 'flex',
            flexWrap: 'wrap' as const,
            gap: '0.375rem',
        },
        interestTag: {
            display: 'inline-block',
            padding: '0.125rem 0.5rem',
            backgroundColor: '#f9fafb',
            color: '#4b5563',
            fontSize: '0.75rem',
            borderRadius: '0.25rem',
            border: '1px solid #f3f4f6',
        }
    };

    return (
        <div
            ref={ref}
            style={{
                // Override all global variables that might use 'lab' or 'oklch' to safe hex values
                // This prevents html2canvas from crashing when parsing computed styles
                '--background': '#ffffff',
                '--foreground': '#000000',
                '--card': '#ffffff',
                '--card-foreground': '#000000',
                '--popover': '#ffffff',
                '--popover-foreground': '#000000',
                '--primary': '#000000',
                '--primary-foreground': '#ffffff',
                '--secondary': '#f3f4f6',
                '--secondary-foreground': '#111827',
                '--muted': '#f3f4f6',
                '--muted-foreground': '#6b7280',
                '--accent': '#f3f4f6',
                '--accent-foreground': '#111827',
                '--destructive': '#ef4444',
                '--destructive-foreground': '#ffffff',
                '--border': '#e5e7eb',
                '--input': '#e5e7eb',
                '--ring': '#000000',
                '--radius': '0.5rem',
                ...styles.page
            } as React.CSSProperties}
        >

            {/* Header Section */}
            <header style={styles.header}>
                <div style={styles.flexBetweenEnd}>
                    <div>
                        <h1 style={styles.h1}>{personalInfo.name}</h1>
                        <h2 style={styles.h2}>{personalInfo.title}</h2>
                    </div>
                    <div style={styles.contactBlock}>
                        <p style={styles.contactItem}>{personalInfo.email}</p>
                        <p style={styles.contactItem}>{personalInfo.phone}</p>
                        <p style={styles.contactItem}>{personalInfo.address}</p>
                    </div>
                </div>
            </header>

            {/* Main Content Grid */}
            <div style={styles.gridContainer}>

                {/* Left Column (Main Info) */}
                <main style={styles.leftColumn}>

                    {/* Professional Summary */}
                    <section style={styles.section}>
                        <h3 style={styles.sectionTitle}>Professional Summary</h3>
                        <p style={styles.textJustify}>
                            {about.description}
                        </p>
                    </section>

                    {/* Work Experience */}
                    <section style={styles.section}>
                        <h3 style={styles.sectionTitle}>Work Experience</h3>
                        <div>
                            {experience.map((job, idx) => (
                                <div key={idx}>
                                    {job.positions.map((pos, pIdx) => (
                                        <div key={pIdx} style={styles.experienceItem}>
                                            <div style={styles.jobHeader} className="cv-item">
                                                <h4 style={styles.jobTitle}>{pos.title}</h4>
                                                <span style={styles.periodBadge}>{pos.period}</span>
                                            </div>
                                            <div style={styles.companyLoc} className="cv-item">
                                                {job.company} — {job.location}
                                            </div>

                                            {/* Narrative as primary content */}
                                            {pos.achievementNarrative ? (
                                                <p style={{ ...styles.textJustify, marginTop: '0.5rem', fontSize: '0.875rem', lineHeight: '1.5', color: '#4b5563' }} className="cv-item">
                                                    {pos.achievementNarrative}
                                                </p>
                                            ) : (
                                                /* Fallback to list if no narrative */
                                                <ul style={styles.list} className="cv-item">
                                                    {pos.achievements.map((ach, aIdx) => (
                                                        <li key={aIdx} style={styles.listItem}>{ach}</li>
                                                    ))}
                                                </ul>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* Key Projects */}
                    <section style={styles.section}>
                        <h3 style={styles.sectionTitle}>Projects ({projects.length})</h3>
                        <div>
                            {projects.map((proj, idx) => (
                                <div key={idx} style={styles.projectItem}>
                                    <div style={{ marginBottom: '0.25rem' }} className="cv-item">
                                        <h4 style={{ ...styles.projectTitle, fontSize: '1rem' }}>{proj.title}</h4>
                                    </div>
                                    <p style={{ ...styles.projectDesc, marginBottom: '0.5rem' }} className="cv-item">{proj.description}</p>
                                    <div style={{ fontSize: '0.75rem', color: '#6b7280', lineHeight: '1.4' }} className="cv-item">
                                        <span style={{ fontWeight: '600', color: '#374151' }}>Tech stack:</span> {proj.tech.join(', ')}
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div style={{ marginTop: '0.5rem', fontSize: '0.75rem', color: '#6b7280', fontStyle: 'italic', textAlign: 'right' }}>
                            * Detailed case studies available at nuralim.dev
                        </div>
                    </section>

                </main>

                {/* Right Column (Skills & Education) */}
                <aside style={styles.rightColumn}>

                    {/* Skills */}
                    <section style={styles.section}>
                        <h3 style={styles.sectionTitle}>Technical Skills</h3>
                        <div>
                            <div style={styles.skillGroup} className="cv-item">
                                <h4 style={styles.skillTitle}>Languages</h4>
                                <p style={styles.skillList}>{skills.techStack.languages.join(', ')}</p>
                            </div>
                            <div style={styles.skillGroup} className="cv-item">
                                <h4 style={styles.skillTitle}>Frontend</h4>
                                <p style={styles.skillList}>{skills.techStack.frontend.join(', ')}</p>
                            </div>
                            <div style={styles.skillGroup} className="cv-item">
                                <h4 style={styles.skillTitle}>Backend & AI</h4>
                                <p style={styles.skillList}>{skills.techStack.backend.join(', ')}</p>
                            </div>
                            <div style={styles.skillGroup} className="cv-item">
                                <h4 style={styles.skillTitle}>Databases</h4>
                                <p style={styles.skillList}>{skills.techStack.databases.join(', ')}</p>
                            </div>
                            <div style={styles.skillGroup} className="cv-item">
                                <h4 style={styles.skillTitle}>DevOps</h4>
                                <p style={styles.skillList}>{skills.techStack.devops.join(', ')}</p>
                            </div>
                            <div style={styles.skillGroup} className="cv-item">
                                <h4 style={styles.skillTitle}>Architecture</h4>
                                <p style={styles.skillList}>{skills.professionalSkills.architecture.join(', ')}</p>
                            </div>
                            <div style={styles.skillGroup} className="cv-item">
                                <h4 style={styles.skillTitle}>Leadership</h4>
                                <p style={styles.skillList}>{skills.professionalSkills.leadership.join(', ')}</p>
                            </div>
                        </div>
                    </section>

                    {/* Education */}
                    <section style={styles.section}>
                        <h3 style={styles.sectionTitle}>Education</h3>
                        <div>
                            {education.map((edu, idx) => (
                                <div key={idx} style={styles.eduItem} className="cv-item">
                                    <h4 style={{ ...styles.projectTitle, marginBottom: '0.25rem' }}>{edu.institution}</h4>
                                    <p style={{ fontSize: '0.875rem', color: '#1f2937', margin: '0 0 0.25rem 0' }}>{edu.degree}</p>
                                    <p style={{ fontSize: '0.75rem', color: '#6b7280', margin: 0 }}>{edu.period}</p>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* Certifications (Extended) */}
                    <section style={styles.section}>
                        <h3 style={styles.sectionTitle}>Certifications</h3>
                        <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                            {certifications.map((cert, idx) => (
                                <li key={idx} style={styles.certItem} className="cv-item">
                                    <span style={{ fontSize: '0.85rem', fontWeight: '600', color: '#1f2937', lineHeight: '1.25' }}>{cert.title}</span>
                                    <span style={{ fontSize: '0.75rem', color: '#6b7280' }}>{cert.issuer}</span>
                                    <span style={{ fontSize: '0.7rem', color: '#9ca3af', lineHeight: '1.2' }}>{cert.skills.slice(0, 3).join(', ')}</span>
                                </li>
                            ))}
                        </ul>
                    </section>

                    {/* Interests */}
                    <section style={styles.section}>
                        <h3 style={styles.sectionTitle}>Interests</h3>
                        <div style={styles.interestGroup}>
                            {interests.map((interest, i) => (
                                <span key={i} style={styles.interestTag}>
                                    {interest}
                                </span>
                            ))}
                        </div>
                    </section>

                </aside>
            </div>
        </div>
    );
});

CVTemplate.displayName = 'CVTemplate';
