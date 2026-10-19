import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { 
  CheckCircle, 
  Send, 
  Play, 
  X, 
  Menu, 
  Calendar, 
  Code2, 
  Smile, 
  Trophy, 
  User, 
  Download, 
  ArrowUpRight, 
  Mail, 
  Phone,
  Sparkles
} from 'lucide-react';

// Tech & Social Brand SVGs (Resilient, zero-dependency)
const GithubIcon = () => (
  <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
    <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/>
  </svg>
);

const LinkedinIcon = () => (
  <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
    <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 8.76a1.45 1.45 0 1 0 0-2.9 1.45 1.45 0 0 0 0 2.9m1.4 9.74v-8.37H5.06v8.37h2.8z"/>
  </svg>
);

const TwitterIcon = () => (
  <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
  </svg>
);

const InstagramIcon = () => (
  <svg className="w-5 h-5 fill-none stroke-current stroke-2" viewBox="0 0 24 24">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
  </svg>
);

const YouTubeIcon = () => (
  <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
  </svg>
);

const FacebookIcon = () => (
  <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
  </svg>
);

const TikTokIcon = () => (
  <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
    <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.97v7.54c-.03 2.53-1.09 5.04-3.03 6.69-2.07 1.76-4.99 2.37-7.6 1.57-2.68-.82-4.88-3.04-5.64-5.74-.78-2.75-.08-5.83 1.83-7.94 1.83-2.02 4.69-2.93 7.37-2.34v4.18c-1.44-.39-3.04-.15-4.24.69-1.15.8-1.78 2.22-1.62 3.63.16 1.38 1.13 2.57 2.48 2.92 1.4.36 2.98-.05 3.93-1.1.58-.65.86-1.51.84-2.39V.02z"/>
  </svg>
);

// Niche & Style Profile Interface
interface NicheProfile {
  category: 'social_media' | 'tech_hub' | 'gaming' | 'lifestyle' | 'developer' | 'general_creator';
  brandEmblem: string;
  roleBadge: string;
  headlineAccent: string;
  bioFallback: string;
  cardBadge: string;
  cardVarName: string;
  cardNiche: string;
  aboutBadge: string;
  aboutTitle1: string;
  aboutTitleHighlight: string;
  aboutP1: string;
  aboutP2: string;
  stats: [
    { value: string; label: string; icon: 'calendar' | 'sparkles' | 'code' | 'smile' | 'trophy' },
    { value: string; label: string; icon: 'calendar' | 'sparkles' | 'code' | 'smile' | 'trophy' },
    { value: string; label: string; icon: 'calendar' | 'sparkles' | 'code' | 'smile' | 'trophy' },
    { value: string; label: string; icon: 'calendar' | 'sparkles' | 'code' | 'smile' | 'trophy' }
  ];
  skillsTitle: string;
  skillsSubtitle: string;
  skills: Array<{ name: string; pct: number; color: string }>;
  defaultProjects: Array<{ title: string; desc: string; image: string; tag: string; url: string }>;
  testimonialQuote: string;
  testimonialAuthor: string;
  testimonialRole: string;
  ctaTag: string;
  ctaTitle: string;
  ctaDesc: string;
  packageFallbackDesc: string;
}

function getCreatorNicheProfile(portfolio: any, socialLinks: any[] = []): NicheProfile {
  const tagline = (portfolio?.tagline || '').toLowerCase();
  const bio = (portfolio?.bio || '').toLowerCase();
  const name = (portfolio?.display_name || '').toLowerCase();
  const pageName = (portfolio?.page_name || '').toLowerCase();
  const platform = (portfolio?.primary_platform || '').toLowerCase();
  const creatorName = portfolio?.page_name || (portfolio?.display_name !== 'Falcus Media Ltd' ? portfolio?.display_name : null) || portfolio?.page_name || portfolio?.display_name || 'Creator';
  const firstName = creatorName;

  // Determine follower reach display string
  let formattedReach = '100K+ Reach';
  if (portfolio?.follower_count && Number(portfolio.follower_count) > 0) {
    const count = Number(portfolio.follower_count);
    if (count >= 1000000) {
      formattedReach = `${(count / 1000000).toFixed(1).replace(/\.0$/, '')}M+ Reach`;
    } else if (count >= 1000) {
      formattedReach = `${(count / 1000).toFixed(0)}K+ Reach`;
    } else {
      formattedReach = `${count.toLocaleString()}+ Reach`;
    }
  } else if (socialLinks && socialLinks.length > 0) {
    const match = socialLinks.find((s: any) => s.followers && s.followers.trim());
    if (match) {
      formattedReach = `${match.followers} Reach`;
    }
  }

  // 1. Comedy, Comics & Entertainment Creators (e.g. Falcus Comics, Comedy Pages)
  if (
    tagline.includes('comic') ||
    tagline.includes('comedy') ||
    tagline.includes('comedian') ||
    tagline.includes('skit') ||
    tagline.includes('entertainment') ||
    name.includes('comic') ||
    name.includes('comedy') ||
    pageName.includes('comic') ||
    pageName.includes('comedy')
  ) {
    return {
      category: 'general_creator',
      brandEmblem: '🎭',
      roleBadge: portfolio?.tagline?.toUpperCase() || 'COMEDY & ENTERTAINMENT CREATOR',
      headlineAccent: 'I create viral comedy, relatable skits & engaging stories.',
      bioFallback: 'Digital creator and entertainer delivering viral sketches, original comedy, and high-impact brand integrations that connect with audiences worldwide.',
      cardBadge: 'CREATOR PROFILE',
      cardVarName: 'entertainer',
      cardNiche: portfolio?.tagline || 'Comedy & Entertainment',
      aboutBadge: `ABOUT ${creatorName.toUpperCase()}`,
      aboutTitle1: 'Dedicated to bringing',
      aboutTitleHighlight: 'humor, joy & authentic entertainment',
      aboutP1: 'With a passionate community and millions of impressions across social channels, I create original comedic content, relatable characters, and memorable sketches that audiences love to share.',
      aboutP2: 'Collaborating with forward-thinking brands to craft natural, hilarious, and high-converting product integrations that resonate with viewers.',
      stats: [
        { value: '4+', label: 'Years Entertaining', icon: 'calendar' },
        { value: '250+', label: 'Sketches & Releases', icon: 'sparkles' },
        { value: formattedReach, label: 'Fanbase & Reach', icon: 'smile' },
        { value: '99%', label: 'Audience Satisfaction', icon: 'trophy' }
      ],
      skillsTitle: 'Creative Capabilities & Reach',
      skillsSubtitle: 'Core entertainment strengths delivering viral watch-time and massive organic shares.',
      skills: [
        { name: 'Viral Comedy & Skit Production', pct: 96, color: 'from-amber-500 to-yellow-500' },
        { name: 'Organic Brand Integrations', pct: 94, color: 'from-purple-500 to-indigo-500' },
        { name: 'Character Acting & Storytelling', pct: 92, color: 'from-pink-500 to-rose-500' },
        { name: 'Shorts & Reels Production', pct: 95, color: 'from-cyan-500 to-blue-500' },
        { name: 'Community Engagement & Viral Shares', pct: 97, color: 'from-emerald-500 to-teal-500' },
        { name: 'Audience Retention & Watch-Time', pct: 90, color: 'from-rose-500 to-orange-500' }
      ],
      defaultProjects: [
        {
          title: 'Viral Relatable Comedy Skit',
          desc: 'High-production comedic sketch generating over 1M+ views and thousands of organic comments.',
          tag: 'Comedy Sketch',
          image: 'https://images.unsplash.com/photo-1514306191717-452ec28c7814?auto=format&fit=crop&w=800&q=80',
          url: '#'
        },
        {
          title: 'Seamless Brand Integration Skit',
          desc: 'Natural comedic integration weaving product benefits directly into a hilarious character storyline.',
          tag: 'Brand Collaboration',
          image: 'https://images.unsplash.com/photo-1533750516457-a7f992034fec?auto=format&fit=crop&w=800&q=80',
          url: '#'
        },
        {
          title: 'Multi-Platform Short-Form Blitz',
          desc: 'Synchronized release across Facebook Reels, YouTube Shorts, and TikTok driving maximum shares.',
          tag: 'Social Growth',
          image: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?auto=format&fit=crop&w=800&q=80',
          url: '#'
        }
      ],
      testimonialQuote: `Working with ${creatorName} was an absolute blast. Their skit brought our product to life with genuine laughs and phenomenal engagement!`,
      testimonialAuthor: 'Amanda Cole',
      testimonialRole: 'Head of Brand Marketing, Peak Viral Media',
      ctaTag: "LET'S WORK TOGETHER",
      ctaTitle: 'Ready to entertain your audience?',
      ctaDesc: "I'm always open to discussing new brand deals, comedic sponsorships, and custom product placements. Let's create something unforgettable together!",
      packageFallbackDesc: 'Full custom skit production, organic brand placement, revisions, and multi-platform promotional usage.'
    };
  }

  // 2. Social Media Management / Media Agency (Matches Falcus Media Ltd)
  if (
    tagline.includes('social media') ||
    tagline.includes('management') ||
    tagline.includes('agency') ||
    tagline.includes('marketing') ||
    name.includes('media ltd') ||
    bio.includes('media kit') ||
    bio.includes('sponsorships and collaborations')
  ) {
    return {
      category: 'social_media',
      brandEmblem: '◈',
      roleBadge: portfolio?.tagline?.toUpperCase() || 'SOCIAL MEDIA & TALENT AGENCY',
      headlineAccent: 'I scale audiences & craft high-impact brand campaigns.',
      bioFallback: 'A premier media collective and creator talent network specializing in viral audience growth, sponsor integrations, and multi-channel creative storytelling.',
      cardBadge: 'MEDIA KIT',
      cardVarName: 'agency',
      cardNiche: portfolio?.tagline || 'Social Media Management',
      aboutBadge: `ABOUT ${creatorName.toUpperCase()}`,
      aboutTitle1: 'We specialize in',
      aboutTitleHighlight: 'scaling digital reach & brand presence',
      aboutP1: 'With deep expertise in social media growth, talent management, and content distribution, we help brands and creators turn audience attention into measurable business results.',
      aboutP2: 'From dedicated video sponsorships and viral short-form campaigns to comprehensive social management, every initiative is built on data-backed creative strategy.',
      stats: [
        { value: '4+', label: 'Years Experience', icon: 'calendar' },
        { value: '150+', label: 'Campaigns Executed', icon: 'sparkles' },
        { value: formattedReach, label: 'Total Reach', icon: 'smile' },
        { value: '99%', label: 'Partner Satisfaction', icon: 'trophy' }
      ],
      skillsTitle: 'Capabilities & Distribution',
      skillsSubtitle: 'Core distribution networks and campaign production capabilities honed across hundreds of brand activations.',
      skills: [
        { name: 'Audience Growth & Strategy', pct: 96, color: 'from-indigo-500 to-purple-500' },
        { name: 'Video Production & Content Creation', pct: 92, color: 'from-cyan-500 to-blue-500' },
        { name: 'Brand Sponsorships & Integration', pct: 95, color: 'from-amber-500 to-rose-500' },
        { name: 'Multi-Platform Distribution', pct: 90, color: 'from-emerald-500 to-green-500' },
        { name: 'Community Engagement & Reach', pct: 94, color: 'from-pink-500 to-purple-500' },
        { name: 'Campaign ROI & Analytics', pct: 88, color: 'from-sky-500 to-indigo-500' }
      ],
      defaultProjects: [
        {
          title: 'Viral Brand Integration',
          desc: 'High-conversion product feature in main content delivering over 500K+ organic impressions and high engagement.',
          tag: 'Sponsored Video',
          image: 'https://images.unsplash.com/photo-1533750516457-a7f992034fec?auto=format&fit=crop&w=800&q=80',
          url: '#'
        },
        {
          title: 'Omnichannel Social Rollout',
          desc: 'Strategic campaign coordination across YouTube, Facebook, and Instagram to maximize brand awareness.',
          tag: 'Social Growth',
          image: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?auto=format&fit=crop&w=800&q=80',
          url: '#'
        },
        {
          title: 'Dedicated Product Showcase',
          desc: 'Full dedicated promotional feature with custom demonstrations, pinned call-to-actions, and community activation.',
          tag: 'Dedicated Campaign',
          image: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=800&q=80',
          url: '#'
        }
      ],
      testimonialQuote: `${creatorName} completely elevated our digital reach. The execution on our product integration was seamless, professional, and delivered our highest performing ROI to date.`,
      testimonialAuthor: 'Marcus Vance',
      testimonialRole: 'VP of Growth, BrandVanguard',
      ctaTag: "LET'S WORK TOGETHER",
      ctaTitle: 'Ready to scale your brand?',
      ctaDesc: "We're open to discussing brand partnerships, sponsored integrations, and creative campaigns. Let's create something extraordinary together!",
      packageFallbackDesc: 'Full campaign production, brand exclusivity, revisions, and multi-platform distribution rights.'
    };
  }

  // 2. Tech Hub / Digital Innovation (Matches Webnix)
  if (
    tagline.includes('tech') ||
    tagline.includes('hub') ||
    tagline.includes('gadget') ||
    tagline.includes('hardware') ||
    tagline.includes('software') ||
    name.includes('webnix') ||
    bio.includes('tech')
  ) {
    return {
      category: 'tech_hub',
      brandEmblem: '</>',
      roleBadge: portfolio?.tagline?.toUpperCase() || 'TECH HUB & DIGITAL MEDIA',
      headlineAccent: 'I cover cutting-edge tech & digital innovation.',
      bioFallback: 'Your premier destination for deep tech reviews, developer insights, software breakdowns, and tech-driven content partnerships.',
      cardBadge: 'TECH HUB',
      cardVarName: 'techHub',
      cardNiche: portfolio?.tagline || 'Tech Hub & Reviews',
      aboutBadge: `ABOUT ${creatorName.toUpperCase()}`,
      aboutTitle1: 'At the forefront of',
      aboutTitleHighlight: 'modern tech analysis & digital media',
      aboutP1: 'At the intersection of consumer technology, developer tools, and digital media, we help tech brands and software companies present their breakthroughs to an enthusiastic, tech-forward audience.',
      aboutP2: 'From hands-on device testing to comprehensive software tutorials, our coverage is known for technical depth, authenticity, and actionable insights.',
      stats: [
        { value: '5+', label: 'Years in Tech', icon: 'calendar' },
        { value: '200+', label: 'Tech Breakdowns', icon: 'code' },
        { value: formattedReach, label: 'Tech Community Reach', icon: 'smile' },
        { value: '99.4%', label: 'Community Trust Rating', icon: 'trophy' }
      ],
      skillsTitle: 'Technical Coverage & Media Skills',
      skillsSubtitle: 'Comprehensive technology testing, benchmarking, and audience distribution capabilities.',
      skills: [
        { name: 'Tech Reviews & Hardware Testing', pct: 95, color: 'from-blue-500 to-cyan-500' },
        { name: 'Software & SaaS Demonstrations', pct: 92, color: 'from-indigo-500 to-purple-500' },
        { name: 'Community Tech Discussions', pct: 90, color: 'from-emerald-500 to-teal-500' },
        { name: 'High-Definition Video Production', pct: 88, color: 'from-amber-500 to-orange-500' },
        { name: 'Tech Ecosystem Analysis', pct: 86, color: 'from-rose-500 to-pink-500' },
        { name: 'Product Launch Sponsorships', pct: 94, color: 'from-purple-500 to-indigo-500' }
      ],
      defaultProjects: [
        {
          title: 'Next-Gen Hardware Benchmark',
          desc: 'Detailed performance testing, thermal analysis, and community review of flagship consumer devices.',
          tag: 'Hardware & Tech',
          image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80',
          url: '#'
        },
        {
          title: 'SaaS Productivity Platform Walkthrough',
          desc: 'In-depth interactive breakdown and productivity workflow demonstration driving developer adoption.',
          tag: 'Software & Cloud',
          image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80',
          url: '#'
        },
        {
          title: 'Tech Ecosystem Launch Campaign',
          desc: 'Multi-channel tech showcase spotlighting emerging consumer tech, AI productivity tools, and software.',
          tag: 'Product Showcase',
          image: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=800&q=80',
          url: '#'
        }
      ],
      testimonialQuote: `${creatorName} provided an authentic, deeply knowledgeable review of our platform. The community engagement and traffic quality were phenomenal.`,
      testimonialAuthor: 'David Chen',
      testimonialRole: 'Head of Product, CloudScale Inc.',
      ctaTag: 'TECH COLLABORATIONS',
      ctaTitle: 'Have a tech product to showcase?',
      ctaDesc: "We're open to reviewing new hardware, SaaS platforms, and developer tooling. Let's introduce your innovation to our community.",
      packageFallbackDesc: 'In-depth testing, screen recordings/4K footage, authentic demonstration, and dedicated promotion.'
    };
  }

  // 3. Gaming & Streaming
  if (
    tagline.includes('game') ||
    tagline.includes('gaming') ||
    tagline.includes('stream') ||
    tagline.includes('esports') ||
    platform === 'twitch'
  ) {
    return {
      category: 'gaming',
      brandEmblem: '🎮',
      roleBadge: portfolio?.tagline?.toUpperCase() || 'ESPORTS & GAMING CREATOR',
      headlineAccent: 'I entertain millions through next-level gaming.',
      bioFallback: 'Pro gamer and content creator delivering high-energy streams, game reviews, and tournament broadcasts.',
      cardBadge: 'GAMER PROFILE',
      cardVarName: 'gamer',
      cardNiche: portfolio?.tagline || 'Gaming & Streaming',
      aboutBadge: `ABOUT ${creatorName.toUpperCase()}`,
      aboutTitle1: 'Driven by',
      aboutTitleHighlight: 'competitive gaming & live community',
      aboutP1: 'Bringing gamers together through high-skill competitive gameplay, entertaining live streams, and honest game reviews.',
      aboutP2: 'Collaborating with premier game studios, peripheral brands, and gaming energy sponsors to deliver immersive activations.',
      stats: [
        { value: '4+', label: 'Years Streaming', icon: 'calendar' },
        { value: '500+', label: 'Live Streams & VODs', icon: 'sparkles' },
        { value: formattedReach, label: 'Gamer Community', icon: 'smile' },
        { value: '99%', label: 'Audience Engagement', icon: 'trophy' }
      ],
      skillsTitle: 'Streaming & Gaming Skills',
      skillsSubtitle: 'Broadcasting telemetry and audience entertainment metrics.',
      skills: [
        { name: 'Live Stream Production & Broadcast', pct: 96, color: 'from-purple-500 to-indigo-500' },
        { name: 'Competitive & Casual Gameplay', pct: 94, color: 'from-red-500 to-rose-500' },
        { name: 'Game Publisher Activations', pct: 90, color: 'from-amber-500 to-yellow-500' },
        { name: 'Discord & Community Building', pct: 92, color: 'from-blue-500 to-cyan-500' },
        { name: 'Short-Form Clips & Highlights', pct: 95, color: 'from-pink-500 to-rose-500' },
        { name: 'Gaming Gear & Tech Reviews', pct: 88, color: 'from-emerald-500 to-green-500' }
      ],
      defaultProjects: [
        {
          title: 'Day-One Title Launch Broadcast',
          desc: 'High-energy live stream and community tournament reaching tens of thousands of concurrent viewers.',
          tag: 'Live Streaming',
          image: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=800&q=80',
          url: '#'
        },
        {
          title: 'Esports Peripherals Showcase',
          desc: 'Hands-on gameplay review of pro-grade wireless peripherals, mechanical keyboards, and displays.',
          tag: 'Gear Review',
          image: 'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?auto=format&fit=crop&w=800&q=80',
          url: '#'
        },
        {
          title: 'Sponsored Tournament Series',
          desc: 'Multi-week community challenge series with custom brand overlays, shoutouts, and giveaway activations.',
          tag: 'Brand Tournament',
          image: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=800&q=80',
          url: '#'
        }
      ],
      testimonialQuote: `${creatorName} was phenomenal to work with. Our community engagement broke records during the campaign launch stream.`,
      testimonialAuthor: 'Alex Thorne',
      testimonialRole: 'Community Lead, Apex Gaming Studio',
      ctaTag: 'GAMING SPONSORSHIPS',
      ctaTitle: 'Launch your game or gear with us',
      ctaDesc: 'Open for publisher partnerships, sponsored streams, and hardware endorsements.',
      packageFallbackDesc: 'Sponsored stream integration, chat commands, social shoutout, and clip distribution.'
    };
  }

  // 4. Developer / Software Engineer
  if (
    tagline.includes('developer') ||
    tagline.includes('engineer') ||
    tagline.includes('coder') ||
    tagline.includes('code') ||
    tagline.includes('full stack') ||
    tagline.includes('frontend') ||
    tagline.includes('backend')
  ) {
    return {
      category: 'developer',
      brandEmblem: '</>',
      roleBadge: portfolio?.tagline?.toUpperCase() || 'FULL STACK DEVELOPER & ENGINEER',
      headlineAccent: 'I build high-performance digital products & web apps.',
      bioFallback: 'Software engineer and developer specializing in scalable web applications, sleek UI/UX, and robust system architecture.',
      cardBadge: '</> Code',
      cardVarName: 'developer',
      cardNiche: portfolio?.tagline || 'Full Stack & Web Dev',
      aboutBadge: `ABOUT ${creatorName.toUpperCase()}`,
      aboutTitle1: 'I’m passionate about',
      aboutTitleHighlight: 'creating modern digital solutions',
      aboutP1: 'With extensive experience in modern web development and digital architecture, I help businesses and startups bring their ideas to life through clean, scalable, and high-impact digital experiences.',
      aboutP2: 'Every project is engineered with precision, from pixel-perfect responsiveness to robust backend architectures and conversion-driven engagement.',
      stats: [
        { value: '5+', label: 'Years Experience', icon: 'calendar' },
        { value: '50+', label: 'Projects Completed', icon: 'code' },
        { value: formattedReach, label: 'Developer Reach', icon: 'smile' },
        { value: '99%', label: 'Client Satisfaction', icon: 'trophy' }
      ],
      skillsTitle: 'Technologies I Master',
      skillsSubtitle: 'Core stack and platform capabilities honed through production deployments and robust systems architecture.',
      skills: [
        { name: 'HTML & Web Architecture', pct: 95, color: 'from-orange-500 to-amber-500' },
        { name: 'React.js & Next.js', pct: 92, color: 'from-cyan-500 to-blue-500' },
        { name: 'Node.js & Backend APIs', pct: 88, color: 'from-emerald-500 to-green-500' },
        { name: 'CSS3 & Modern Tailwind', pct: 94, color: 'from-sky-500 to-indigo-500' },
        { name: 'TypeScript & JavaScript', pct: 90, color: 'from-yellow-500 to-amber-500' },
        { name: 'Git & Cloud Deployment', pct: 86, color: 'from-rose-500 to-pink-500' }
      ],
      defaultProjects: [
        {
          title: 'E-Commerce Cloud Platform',
          desc: 'Full-stack e-commerce solution with modern UI/UX and seamless checkout experience.',
          tag: 'Web & Fullstack',
          image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80',
          url: '#'
        },
        {
          title: 'Collaborative Task App',
          desc: 'Real-time collaborative task management application built for high-output creative teams.',
          tag: 'UI/UX & Mobile',
          image: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=800&q=80',
          url: '#'
        },
        {
          title: 'Telemetry & Data Dashboard',
          desc: 'Real-time cryptocurrency and metrics tracking dashboard with live interactive charts.',
          tag: 'Fintech & Data',
          image: 'https://images.unsplash.com/photo-1642543492481-44e81e3914a7?auto=format&fit=crop&w=800&q=80',
          url: '#'
        }
      ],
      testimonialQuote: `${firstName} is an exceptional developer who delivers high-quality work on time. Attention to detail and problem-solving skills are outstanding.`,
      testimonialAuthor: 'Sarah Johnson',
      testimonialRole: 'CEO, TechStart Inc.',
      ctaTag: "LET'S WORK TOGETHER",
      ctaTitle: 'Have a project in mind?',
      ctaDesc: "I'm always open to discussing new development projects, creative ideas, and contracting opportunities. Let's create something amazing together!",
      packageFallbackDesc: 'Full development delivery, automated testing, revisions, and production deployment.'
    };
  }

  // 5. Default General Creator / Media Talent
  return {
    category: 'general_creator',
    brandEmblem: '◈',
    roleBadge: portfolio?.tagline?.toUpperCase() || 'DIGITAL CREATOR & MEDIA TALENT',
    headlineAccent: 'I create captivating content & high-impact brand stories.',
    bioFallback: 'Digital creator specializing in high-engagement storytelling, audience building, and premium commercial partnerships with top brands.',
    cardBadge: 'CREATOR PROFILE',
    cardVarName: 'creator',
    cardNiche: portfolio?.tagline || 'Content Creation',
    aboutBadge: `ABOUT ${creatorName.toUpperCase()}`,
    aboutTitle1: 'Passionate about',
    aboutTitleHighlight: 'creative storytelling & community connection',
    aboutP1: 'Dedicated to creating memorable digital content that entertains, inspires, and connects with audiences on an authentic level.',
    aboutP2: 'Partnering with progressive brands to craft organic sponsor integrations and high-converting marketing campaigns.',
    stats: [
      { value: '4+', label: 'Years Creating', icon: 'calendar' },
      { value: '120+', label: 'Productions & Releases', icon: 'sparkles' },
      { value: formattedReach, label: 'Audience & Community', icon: 'smile' },
      { value: '99%', label: 'Brand Satisfaction', icon: 'trophy' }
    ],
    skillsTitle: 'Creative Capabilities & Distribution',
    skillsSubtitle: 'Core production and media distribution strengths delivering high audience retention.',
    skills: [
      { name: 'High-Definition Video Production', pct: 95, color: 'from-indigo-500 to-purple-500' },
      { name: 'Brand Sponsorships & Integration', pct: 92, color: 'from-amber-500 to-rose-500' },
      { name: 'Audience Engagement & Storytelling', pct: 94, color: 'from-pink-500 to-purple-500' },
      { name: 'Multi-Platform Distribution', pct: 90, color: 'from-cyan-500 to-blue-500' },
      { name: 'Creative Direction & Concepts', pct: 88, color: 'from-emerald-500 to-teal-500' },
      { name: 'Campaign ROI & Conversion', pct: 91, color: 'from-sky-500 to-indigo-500' }
    ],
    defaultProjects: [
      {
        title: 'Viral Brand Collaboration',
        desc: 'High-production brand feature driving record organic reach and community engagement.',
        tag: 'Sponsored Video',
        image: 'https://images.unsplash.com/photo-1533750516457-a7f992034fec?auto=format&fit=crop&w=800&q=80',
        url: '#'
      },
      {
        title: 'Multi-Platform Audience Launch',
        desc: 'Strategic cross-network content rollout maximizing brand awareness, saves, and shares.',
        tag: 'Social Growth',
        image: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?auto=format&fit=crop&w=800&q=80',
        url: '#'
      },
      {
        title: 'Exclusive Product Feature',
        desc: 'Full dedicated showcase highlighting product value proposition and call-to-action.',
        tag: 'Dedicated Feature',
        image: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=800&q=80',
        url: '#'
      }
    ],
    testimonialQuote: `Working with ${creatorName} was an absolute game changer for our campaign. Their audience connection and creative execution drove remarkable results.`,
    testimonialAuthor: 'Elena Rostova',
    testimonialRole: 'Senior Marketing Director, Nova Media',
    ctaTag: "LET'S WORK TOGETHER",
    ctaTitle: 'Have a campaign or project in mind?',
    ctaDesc: "I'm always open to discussing new brand deals, sponsorships, and creative concepts. Let's create something extraordinary together!",
    packageFallbackDesc: 'Full content delivery, brand exclusivity, revisions, and multi-platform promotional usage.'
  };
}

export default function PublicPortfolio() {
  const { slug } = useParams<{ slug: string }>();
  const [portfolio, setPortfolio] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Inquiry Form State
  const [brandName, setBrandName] = useState('');
  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [budget, setBudget] = useState('Flexible / Open to Quote');
  const [campaignDetails, setCampaignDetails] = useState('');
  const [submittingInquiry, setSubmittingInquiry] = useState(false);
  const [inquirySuccess, setInquirySuccess] = useState(false);
  const [inquiryError, setInquiryError] = useState('');

  // Video / Project Modal State
  const [activeVideoUrl, setActiveVideoUrl] = useState<string | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Active slug
  const activeSlug = slug || window.location.pathname.replace(/^\/(?:p\/)?/, '').split('/')[0];

  // Dynamically set browser tab / page title to the Creator's Page Name
  useEffect(() => {
    if (portfolio) {
      const pageTitle = portfolio.page_name || (portfolio.display_name !== 'Falcus Media Ltd' ? portfolio.display_name : null) || portfolio.page_name || portfolio.display_name || 'Creator Portfolio';
      document.title = pageTitle;
    } else if (activeSlug) {
      const formattedSlug = activeSlug
        .split('-')
        .map((w: string) => w.charAt(0).toUpperCase() + w.slice(1))
        .join(' ');
      document.title = formattedSlug;
    }
    return () => {
      document.title = 'Falcus Media Agency';
    };
  }, [portfolio, activeSlug]);

  useEffect(() => {
    if (activeSlug) {
      fetchPublicPortfolio(activeSlug);
    } else {
      setError('No portfolio identifier provided in URL.');
      setLoading(false);
    }
  }, [activeSlug]);

  const fetchPublicPortfolio = async (portfolioSlug: string) => {
    setLoading(true);
    setError('');
    try {
      const res = await axios.get(`/api/portfolio/public/${portfolioSlug}`);
      if (res.data && res.data.portfolio) {
        setPortfolio(res.data.portfolio);
      } else {
        setError('Portfolio not found.');
      }
    } catch (err: any) {
      console.error('Failed to load portfolio:', err);
      setError(err.response?.data?.error || 'Unable to retrieve public portfolio.');
    } finally {
      setLoading(false);
    }
  };

  const handleInquirySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!brandName || !contactName || !contactEmail || !campaignDetails) {
      setInquiryError('Please complete all required fields.');
      return;
    }

    setSubmittingInquiry(true);
    setInquiryError('');
    setInquirySuccess(false);

    try {
      await axios.post(`/api/portfolio/public/${activeSlug}/inquiry`, {
        brand_name: brandName,
        contact_name: contactName,
        contact_email: contactEmail,
        budget,
        campaign_details: campaignDetails
      });

      setInquirySuccess(true);
      setBrandName('');
      setContactName('');
      setContactEmail('');
      setBudget('Flexible / Open to Quote');
      setCampaignDetails('');
    } catch (err: any) {
      console.error('Failed to submit inquiry:', err);
      setInquiryError(err.response?.data?.error || 'Failed to submit proposal. Please try again.');
    } finally {
      setSubmittingInquiry(false);
    }
  };

  const scrollToSection = (id: string, packageTitle?: string) => {
    if (packageTitle) {
      setCampaignDetails((prev) => 
        prev ? `${prev}\nInterested In: ${packageTitle}` : `Interested In: ${packageTitle}`
      );
    }
    const elem = document.getElementById(id);
    if (elem) {
      elem.scrollIntoView({ behavior: 'smooth' });
    }
    setMobileMenuOpen(false);
  };

  const getEmbedUrl = (url: string) => {
    if (!url) return null;
    if (url.includes('youtube.com/watch?v=')) {
      const videoId = url.split('v=')[1]?.split('&')[0];
      return `https://www.youtube.com/embed/${videoId}?autoplay=1`;
    }
    if (url.includes('youtu.be/')) {
      const videoId = url.split('youtu.be/')[1]?.split('?')[0];
      return `https://www.youtube.com/embed/${videoId}?autoplay=1`;
    }
    return null;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#07070d] flex flex-col items-center justify-center text-white">
        <div className="w-12 h-12 rounded-full border-2 border-indigo-500 border-t-transparent animate-spin mb-4" />
        <p className="font-mono text-xs uppercase tracking-widest text-indigo-400">Loading Portfolio...</p>
      </div>
    );
  }

  if (error || !portfolio) {
    return (
      <div className="min-h-screen bg-[#07070d] flex flex-col items-center justify-center text-white px-4">
        <div className="max-w-md w-full bg-[#0d0e17] border border-white/10 p-10 rounded-3xl shadow-2xl text-center space-y-5">
          <div className="w-16 h-16 rounded-2xl bg-indigo-600/20 text-indigo-400 flex items-center justify-center mx-auto text-2xl font-bold">
            !
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white">Portfolio Unavailable</h1>
          <p className="text-gray-400 text-sm leading-relaxed">
            {error || 'This creator portfolio could not be found or has not been published yet.'}
          </p>
          <div className="pt-2">
            <Link
              to="/login"
              className="inline-flex items-center px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold uppercase tracking-wider transition-colors shadow-lg shadow-indigo-600/30"
            >
              Creator Portal Login
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const socialLinks = Array.isArray(portfolio.social_links)
    ? portfolio.social_links
    : typeof portfolio.social_links === 'string'
    ? JSON.parse(portfolio.social_links || '[]')
    : [];

  const featuredMedia = Array.isArray(portfolio.featured_media)
    ? portfolio.featured_media
    : typeof portfolio.featured_media === 'string'
    ? JSON.parse(portfolio.featured_media || '[]')
    : [];

  const services = Array.isArray(portfolio.services)
    ? portfolio.services
    : typeof portfolio.services === 'string'
    ? JSON.parse(portfolio.services || '[]')
    : [];

  const creatorName = portfolio.page_name || (portfolio.display_name !== 'Falcus Media Ltd' ? portfolio.display_name : null) || portfolio.page_name || portfolio.display_name || 'Creator';
  const firstName = creatorName;
  const avatarUrl = portfolio.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80';
  
  // Intelligent Niche & Style Profile Customization
  const nicheProfile = getCreatorNicheProfile(portfolio, socialLinks);
  const roleTitle = portfolio.tagline ? portfolio.tagline.toUpperCase() : nicheProfile.roleBadge;
  const projectsToDisplay = featuredMedia.length > 0 ? featuredMedia : nicheProfile.defaultProjects;
  const primaryPlatform = portfolio.primary_platform || (socialLinks[0]?.platform) || 'YouTube';

  // Dynamic Badges for Hero
  const getHeroBadges = () => {
    const badges: { label: string; icon?: React.ReactNode; color: string }[] = [];
    
    // Add existing social channels first
    if (socialLinks.length > 0) {
      socialLinks.forEach((s: any) => {
        const p = (s.platform || '').toLowerCase();
        if (p.includes('youtube')) badges.push({ label: 'YouTube', icon: <YouTubeIcon />, color: 'hover:border-red-500/50 text-red-400' });
        else if (p.includes('facebook')) badges.push({ label: 'Facebook', icon: <FacebookIcon />, color: 'hover:border-blue-600/50 text-blue-500' });
        else if (p.includes('instagram')) badges.push({ label: 'Instagram', icon: <InstagramIcon />, color: 'hover:border-pink-500/50 text-pink-400' });
        else if (p.includes('tiktok')) badges.push({ label: 'TikTok', icon: <TikTokIcon />, color: 'hover:border-cyan-400/50 text-cyan-400' });
        else if (p.includes('twitter') || p.includes('x')) badges.push({ label: 'X / Twitter', icon: <TwitterIcon />, color: 'hover:border-gray-400/50 text-gray-300' });
        else if (p.includes('linkedin')) badges.push({ label: 'LinkedIn', icon: <LinkedinIcon />, color: 'hover:border-blue-400/50 text-blue-400' });
        else if (p.includes('github')) badges.push({ label: 'GitHub', icon: <GithubIcon />, color: 'hover:border-white/50 text-white' });
      });
    }

    // Complement with niche capabilities
    if (nicheProfile.category === 'social_media') {
      if (!badges.some(b => b.label === 'YouTube')) badges.push({ label: 'YouTube', icon: <YouTubeIcon />, color: 'hover:border-red-500/50 text-red-400' });
      if (!badges.some(b => b.label === 'Facebook')) badges.push({ label: 'Facebook', icon: <FacebookIcon />, color: 'hover:border-blue-600/50 text-blue-500' });
      if (!badges.some(b => b.label === 'Instagram')) badges.push({ label: 'Instagram', icon: <InstagramIcon />, color: 'hover:border-pink-500/50 text-pink-400' });
      badges.push({ label: 'Brand Deals', color: 'hover:border-amber-500/50 text-amber-400' });
      badges.push({ label: 'Shorts & Reels', color: 'hover:border-purple-500/50 text-purple-400' });
      badges.push({ label: 'Sponsorships', color: 'hover:border-emerald-500/50 text-emerald-400' });
    } else if (nicheProfile.category === 'tech_hub') {
      if (!badges.some(b => b.label === 'Facebook')) badges.push({ label: 'Facebook', icon: <FacebookIcon />, color: 'hover:border-blue-600/50 text-blue-500' });
      if (!badges.some(b => b.label === 'YouTube')) badges.push({ label: 'YouTube', icon: <YouTubeIcon />, color: 'hover:border-red-500/50 text-red-400' });
      badges.push({ label: 'Hardware', color: 'hover:border-cyan-500/50 text-cyan-400' });
      badges.push({ label: 'SaaS & Apps', color: 'hover:border-indigo-500/50 text-indigo-400' });
      badges.push({ label: 'Tech Reviews', color: 'hover:border-yellow-500/50 text-yellow-400' });
      badges.push({ label: 'AI Tools', color: 'hover:border-purple-500/50 text-purple-400' });
    } else if (nicheProfile.category === 'developer') {
      badges.push({ label: 'React.js', color: 'hover:border-cyan-400/50 text-cyan-400' });
      badges.push({ label: 'Next.js', color: 'hover:border-white/50 text-white' });
      badges.push({ label: 'TypeScript', color: 'hover:border-blue-400/50 text-blue-400' });
      badges.push({ label: 'Node.js', color: 'hover:border-emerald-500/50 text-emerald-400' });
      badges.push({ label: 'Tailwind CSS', color: 'hover:border-sky-400/50 text-sky-400' });
    } else {
      if (!badges.some(b => b.label === 'YouTube')) badges.push({ label: 'YouTube', icon: <YouTubeIcon />, color: 'hover:border-red-500/50 text-red-400' });
      if (!badges.some(b => b.label === 'Instagram')) badges.push({ label: 'Instagram', icon: <InstagramIcon />, color: 'hover:border-pink-500/50 text-pink-400' });
      badges.push({ label: '4K Production', color: 'hover:border-rose-400/50 text-rose-400' });
      badges.push({ label: 'Brand Integrations', color: 'hover:border-amber-400/50 text-amber-400' });
      badges.push({ label: 'Audience Strategy', color: 'hover:border-indigo-400/50 text-indigo-400' });
    }

    return badges.slice(0, 8);
  };

  const heroBadges = getHeroBadges();

  return (
    <div className="min-h-screen bg-[#07070d] text-gray-200 selection:bg-indigo-500 selection:text-white font-sans antialiased overflow-x-hidden">
      
      {/* =========================================================================
          TOP NAVBAR (Matches CodeCraft Header in Reference)
         ========================================================================= */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#07070d]/85 backdrop-blur-xl border-b border-white/5 transition-all">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          
          {/* Brand Logo: CodeCraft / Name */}
          <Link to="/" className="flex items-center space-x-2 text-white font-bold text-lg tracking-tight group">
            <span className="text-indigo-400 font-mono text-xl font-extrabold group-hover:scale-110 transition-transform">
              {nicheProfile.brandEmblem}
            </span>
            <span className="tracking-tight">{creatorName}</span>
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center space-x-8 text-sm font-medium text-gray-400">
            <button onClick={() => scrollToSection('hero')} className="hover:text-white transition-colors">
              Home
            </button>
            <button onClick={() => scrollToSection('about')} className="hover:text-white transition-colors">
              About
            </button>
            <button onClick={() => scrollToSection('skills')} className="hover:text-white transition-colors">
              Skills
            </button>
            <button onClick={() => scrollToSection('projects')} className="hover:text-white transition-colors">
              Projects
            </button>
            <button onClick={() => scrollToSection('packages')} className="hover:text-white transition-colors">
              Rates
            </button>
            <button onClick={() => scrollToSection('contact')} className="hover:text-white transition-colors">
              Contact
            </button>
          </div>

          {/* Hire Me CTA Button */}
          <div className="flex items-center space-x-4">
            <button 
              onClick={() => scrollToSection('contact')}
              className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-full text-xs font-semibold tracking-wide transition-all shadow-lg shadow-indigo-600/30 hover:shadow-indigo-500/50 flex items-center"
            >
              <span>Work With Me</span>
              <ArrowUpRight className="w-3.5 h-3.5 ml-1" />
            </button>

            {/* Mobile Hamburger Menu Toggle */}
            <button 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden text-gray-400 hover:text-white p-2"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-[#0c0d16] border-b border-white/10 px-6 py-4 space-y-3 font-medium text-sm">
            <button onClick={() => scrollToSection('hero')} className="block w-full text-left py-1 text-gray-300 hover:text-indigo-400">Home</button>
            <button onClick={() => scrollToSection('about')} className="block w-full text-left py-1 text-gray-300 hover:text-indigo-400">About</button>
            <button onClick={() => scrollToSection('skills')} className="block w-full text-left py-1 text-gray-300 hover:text-indigo-400">Skills</button>
            <button onClick={() => scrollToSection('projects')} className="block w-full text-left py-1 text-gray-300 hover:text-indigo-400">Projects</button>
            <button onClick={() => scrollToSection('packages')} className="block w-full text-left py-1 text-gray-300 hover:text-indigo-400">Rates</button>
            <button onClick={() => scrollToSection('contact')} className="block w-full text-left py-1 text-gray-300 hover:text-indigo-400">Contact</button>
          </div>
        )}
      </nav>

      {/* =========================================================================
          SECTION 1: HERO SECTION WITH GLOWING PURPLE AURA & FLOATING CODE CARD
         ========================================================================= */}
      <section id="hero" className="relative pt-32 pb-20 md:pt-40 md:pb-28 px-6 max-w-7xl mx-auto overflow-hidden">
        
        {/* Ambient Background Radial Glows */}
        <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-600/15 rounded-full blur-[140px] pointer-events-none" />
        <div className="absolute top-1/3 right-10 w-96 h-96 bg-purple-600/20 rounded-full blur-[160px] pointer-events-none" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Column: Headline, Bio & CTAs */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Pill Tag */}
            <div className="inline-flex items-center px-4 py-1.5 rounded-full text-xs font-semibold bg-indigo-950/60 text-indigo-400 border border-indigo-500/30 shadow-inner">
              <Sparkles className="w-3.5 h-3.5 mr-1.5 text-indigo-400" />
              <span className="uppercase tracking-wider">{roleTitle}</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold text-white tracking-tight leading-[1.1]">
              Hi, I’m{' '}
              <span className="bg-gradient-to-r from-indigo-400 via-purple-300 to-pink-400 bg-clip-text text-transparent">
                {firstName}
              </span> <br />
              <span className="text-2xl sm:text-4xl md:text-5xl font-bold text-gray-300">
                {nicheProfile.headlineAccent}
              </span>
            </h1>

            {/* Sub-paragraph */}
            <p className="text-gray-400 text-base sm:text-lg max-w-xl leading-relaxed">
              {portfolio.bio || nicheProfile.bioFallback}
            </p>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button
                onClick={() => scrollToSection('projects')}
                className="px-7 py-3.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-full text-xs font-semibold tracking-wider transition-all shadow-lg shadow-indigo-600/30 hover:shadow-indigo-500/50 flex items-center"
              >
                <span>View My Work</span>
                <ArrowUpRight className="w-4 h-4 ml-1.5" />
              </button>

              <button
                onClick={() => scrollToSection('contact')}
                className="px-7 py-3.5 bg-white/5 hover:bg-white/10 text-white border border-white/10 hover:border-white/20 rounded-full text-xs font-semibold tracking-wider transition-all flex items-center"
              >
                <Download className="w-4 h-4 mr-2 text-indigo-400" />
                <span>Download Media Kit</span>
              </button>
            </div>

            {/* Technologies & Platforms I Work With Row */}
            <div className="pt-6 space-y-3">
              <span className="text-xs uppercase tracking-widest text-gray-500 font-semibold block">
                Active Platforms & Capabilities
              </span>
              <div className="flex flex-wrap items-center gap-3 text-gray-400">
                {heroBadges.map((badge, bIdx) => (
                  <div 
                    key={bIdx}
                    className={`h-10 px-3.5 rounded-xl bg-white/[0.04] border border-white/10 flex items-center space-x-2 transition-all cursor-default ${badge.color}`}
                    title={badge.label}
                  >
                    {badge.icon && <span>{badge.icon}</span>}
                    <span className="font-mono text-xs font-bold">{badge.label}</span>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Right Column: Portrait in Glowing Circle + Floating Code Card */}
          <div className="lg:col-span-5 relative flex items-center justify-center">
            
            {/* The Big Glowing Purple Orb */}
            <div className="relative w-72 sm:w-96 h-72 sm:h-96 rounded-full bg-gradient-to-tr from-purple-700 via-indigo-600 to-purple-500 p-1 shadow-[0_0_90px_rgba(124,58,237,0.45)] flex items-end justify-center overflow-hidden">
              <img 
                src={avatarUrl} 
                alt={creatorName}
                className="w-full h-full object-cover object-top filter contrast-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#07070d] via-transparent to-transparent opacity-40" />
            </div>

            {/* Floating Glassmorphic Code Card (Matches Reference Image) */}
            <div className="absolute -bottom-6 -right-2 sm:-right-6 w-64 sm:w-80 bg-[#0c0d18]/90 backdrop-blur-xl border border-white/15 rounded-2xl p-4 shadow-2xl font-mono text-[11px] space-y-2 select-none pointer-events-none transform rotate-1 hover:rotate-0 transition-transform">
              <div className="flex items-center justify-between pb-1.5 border-b border-white/10 text-gray-500 text-[10px]">
                <div className="flex items-center space-x-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
                  <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/80" />
                  <span className="w-2.5 h-2.5 rounded-full bg-green-500/80" />
                </div>
                <span className="text-indigo-400 font-semibold">{nicheProfile.cardBadge}</span>
              </div>
              <div className="text-gray-300 leading-relaxed font-mono">
                <span className="text-pink-400">const</span> <span className="text-yellow-300">{nicheProfile.cardVarName}</span> = {'{'}<br />
                &nbsp;&nbsp;<span className="text-indigo-300">name</span>: <span className="text-emerald-300">"{creatorName}"</span>,<br />
                &nbsp;&nbsp;<span className="text-indigo-300">niche</span>: <span className="text-emerald-300">"{nicheProfile.cardNiche}"</span>,<br />
                &nbsp;&nbsp;<span className="text-indigo-300">platform</span>: <span className="text-emerald-300">"{primaryPlatform}"</span>,<br />
                &nbsp;&nbsp;<span className="text-indigo-300">reach</span>: <span className="text-emerald-300">"{nicheProfile.stats[2].value}"</span>,<br />
                &nbsp;&nbsp;<span className="text-indigo-300">status</span>: <span className="text-emerald-300">"Available for Booking"</span><br />
                {'};'}
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* =========================================================================
          SECTION 2: ABOUT ME & 2X2 METRICS GRID
         ========================================================================= */}
      <section id="about" className="py-24 px-6 max-w-7xl mx-auto border-t border-white/5">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Text */}
          <div className="lg:col-span-6 space-y-6">
            <span className="text-xs uppercase tracking-widest font-semibold text-indigo-400 bg-indigo-950/40 border border-indigo-500/30 px-3.5 py-1.5 rounded-full inline-block">
              {nicheProfile.aboutBadge}
            </span>
            <h2 className="text-3xl sm:text-5xl font-bold text-white tracking-tight leading-tight">
              {nicheProfile.aboutTitle1} <br />
              <span className="text-indigo-400">{nicheProfile.aboutTitleHighlight}</span>
            </h2>
            <p className="text-gray-400 text-sm sm:text-base leading-relaxed">
              {nicheProfile.aboutP1}
            </p>
            <p className="text-gray-400 text-sm leading-relaxed">
              {nicheProfile.aboutP2}
            </p>
            <div>
              <button 
                onClick={() => scrollToSection('contact')}
                className="px-6 py-3 bg-white/5 hover:bg-white/10 text-white border border-white/10 rounded-full text-xs font-semibold tracking-wide transition-all flex items-center"
              >
                <User className="w-4 h-4 mr-2 text-indigo-400" />
                <span>Learn More About Me</span>
              </button>
            </div>
          </div>

          {/* Right 2x2 Stats Grid (Matches Reference Image) */}
          <div className="lg:col-span-6 grid grid-cols-1 sm:grid-cols-2 gap-5">
            {nicheProfile.stats.map((st, sIdx) => {
              const borderHoverColor = sIdx === 0 ? 'hover:border-indigo-500/40' : sIdx === 1 ? 'hover:border-purple-500/40' : sIdx === 2 ? 'hover:border-cyan-500/40' : 'hover:border-amber-500/40';
              const iconBg = sIdx === 0 ? 'bg-indigo-600/20 text-indigo-400 border-indigo-500/30' : sIdx === 1 ? 'bg-purple-600/20 text-purple-400 border-purple-500/30' : sIdx === 2 ? 'bg-cyan-600/20 text-cyan-400 border-cyan-500/30' : 'bg-amber-600/20 text-amber-400 border-amber-500/30';
              return (
                <div key={sIdx} className={`bg-[#0c0d18] border border-white/10 rounded-2xl p-6 flex items-start space-x-4 shadow-xl ${borderHoverColor} transition-colors`}>
                  <div className={`w-12 h-12 rounded-xl border flex items-center justify-center flex-shrink-0 ${iconBg}`}>
                    {st.icon === 'calendar' ? <Calendar className="w-6 h-6" /> :
                     st.icon === 'code' ? <Code2 className="w-6 h-6" /> :
                     st.icon === 'smile' ? <Smile className="w-6 h-6" /> :
                     st.icon === 'trophy' ? <Trophy className="w-6 h-6" /> :
                     <Sparkles className="w-6 h-6" />}
                  </div>
                  <div>
                    <div className="text-3xl font-extrabold text-white">{st.value}</div>
                    <div className="text-xs text-gray-400 mt-1 uppercase tracking-wider font-semibold">{st.label}</div>
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* =========================================================================
          SECTION 3: CORE CAPABILITIES & SKILLS (3-COLUMN PROGRESS GRID)
         ========================================================================= */}
      <section id="skills" className="py-24 px-6 max-w-7xl mx-auto border-t border-white/5">
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
          <span className="text-xs uppercase tracking-widest font-semibold text-indigo-400 bg-indigo-950/40 border border-indigo-500/30 px-3.5 py-1.5 rounded-full inline-block">
            CAPABILITIES & METRICS
          </span>
          <h2 className="text-3xl sm:text-5xl font-bold text-white tracking-tight">
            {nicheProfile.skillsTitle}
          </h2>
          <p className="text-gray-400 text-sm">
            {nicheProfile.skillsSubtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {nicheProfile.skills.map((skill, index) => (
            <div 
              key={index}
              className="bg-[#0c0d18] border border-white/10 rounded-2xl p-6 shadow-xl space-y-4 hover:border-indigo-500/30 transition-all"
            >
              <div className="flex items-center justify-between">
                <span className="font-semibold text-sm text-white">{skill.name}</span>
                <span className="font-mono text-xs font-bold text-indigo-400">{skill.pct}%</span>
              </div>
              {/* Progress Bar Track */}
              <div className="w-full h-2 rounded-full bg-white/5 overflow-hidden">
                <div 
                  className={`h-full rounded-full bg-gradient-to-r ${skill.color} transition-all duration-1000`}
                  style={{ width: `${skill.pct}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* =========================================================================
          SECTION 4: FEATURED PROJECTS / RECENT WORK SHOWCASE
         ========================================================================= */}
      <section id="projects" className="py-24 px-6 max-w-7xl mx-auto border-t border-white/5">
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
          <span className="text-xs uppercase tracking-widest font-semibold text-indigo-400 bg-indigo-950/40 border border-indigo-500/30 px-3.5 py-1.5 rounded-full inline-block">
            FEATURED PORTFOLIO
          </span>
          <h2 className="text-3xl sm:text-5xl font-bold text-white tracking-tight">
            Featured Work & Campaigns
          </h2>
          <p className="text-gray-400 text-sm">
            Explore recent productions, campaigns, and high-impact deliverables.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {projectsToDisplay.map((project: any, idx: number) => {
            const embed = getEmbedUrl(project.url);
            const num = String(idx + 1).padStart(2, '0');
            return (
              <div 
                key={idx}
                className="bg-[#0c0d18] border border-white/10 rounded-3xl overflow-hidden shadow-2xl flex flex-col justify-between group hover:border-indigo-500/40 transition-all duration-300"
              >
                <div>
                  {/* Image Container with Number Badge */}
                  <div className="relative aspect-video bg-neutral-900 overflow-hidden">
                    <img 
                      src={project.thumbnail_url || project.image || nicheProfile.defaultProjects[idx % 3].image} 
                      alt={project.title}
                      className="w-full h-full object-cover filter contrast-105 group-hover:scale-105 transition-transform duration-500" 
                    />
                    <div className="absolute top-3 left-3 px-2.5 py-1 rounded-lg bg-black/70 backdrop-blur-md text-[11px] font-mono font-bold text-indigo-400 border border-white/10">
                      {num}
                    </div>
                    {embed && (
                      <div 
                        onClick={() => setActiveVideoUrl(embed)}
                        className="absolute inset-0 bg-black/40 flex items-center justify-center cursor-pointer group-hover:bg-black/20 transition-colors"
                      >
                        <div className="w-12 h-12 rounded-full bg-indigo-600/90 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                          <Play className="w-5 h-5 fill-white text-white ml-0.5" />
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Body Content */}
                  <div className="p-6 space-y-2">
                    <div className="inline-block px-2.5 py-0.5 rounded-md bg-indigo-950/60 text-indigo-400 text-[10px] font-mono uppercase tracking-wider border border-indigo-500/20">
                      {project.tag || 'Featured Campaign'}
                    </div>
                    <h3 className="font-bold text-lg text-white group-hover:text-indigo-400 transition-colors line-clamp-1">
                      {project.title}
                    </h3>
                    <p className="text-gray-400 text-xs leading-relaxed line-clamp-3">
                      {project.desc || project.description || "High-performance deliverable delivering seamless user engagement and conversion."}
                    </p>
                  </div>
                </div>

                {/* Footer Link */}
                <div className="p-6 pt-0 flex items-center justify-between">
                  <button
                    onClick={() => embed ? setActiveVideoUrl(embed) : project.url && project.url !== '#' ? window.open(project.url, '_blank') : scrollToSection('contact')}
                    className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 flex items-center"
                  >
                    <span>View Details</span>
                    <ArrowUpRight className="w-3.5 h-3.5 ml-1" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* =========================================================================
          SECTION 5: COLLABORATION PACKAGES & RATES
         ========================================================================= */}
      <section id="packages" className="py-24 px-6 max-w-7xl mx-auto border-t border-white/5">
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
          <span className="text-xs uppercase tracking-widest font-semibold text-indigo-400 bg-indigo-950/40 border border-indigo-500/30 px-3.5 py-1.5 rounded-full inline-block">
            RATES & PACKAGES
          </span>
          <h2 className="text-3xl sm:text-5xl font-bold text-white tracking-tight">
            Transparent Pricing
          </h2>
          <p className="text-gray-400 text-sm">
            Choose a collaboration tier or request a custom proposal tailored to your timeline.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {services.length > 0 ? (
            services.map((srv: any, idx: number) => {
              const isPopular = idx === 1;
              return (
                <div 
                  key={idx}
                  className={`rounded-3xl p-8 flex flex-col justify-between transition-all duration-300 ${
                    isPopular 
                      ? 'bg-gradient-to-b from-indigo-950/80 to-[#0c0d18] border-2 border-indigo-500 shadow-2xl shadow-indigo-500/20 md:-translate-y-2' 
                      : 'bg-[#0c0d18] border border-white/10 shadow-xl hover:-translate-y-1'
                  }`}
                >
                  <div>
                    {isPopular && (
                      <span className="inline-block px-3 py-1 bg-indigo-600 text-white rounded-full text-[10px] font-bold uppercase tracking-wider mb-4">
                        Most Popular
                      </span>
                    )}
                    <h3 className="text-xl font-bold text-white tracking-tight">
                      {srv.title || 'Campaign Deliverable'}
                    </h3>
                    <div className="mt-4 flex items-baseline">
                      <span className="text-4xl font-extrabold text-white">
                        {srv.price ? `$${srv.price.replace('$', '')}` : 'Custom'}
                      </span>
                      <span className="ml-2 text-xs uppercase font-mono text-gray-400">
                        / Deliverable
                      </span>
                    </div>
                    <p className="mt-4 text-xs text-gray-400 leading-relaxed">
                      {srv.description || nicheProfile.packageFallbackDesc}
                    </p>
                  </div>

                  <div className="mt-8 pt-6 border-t border-white/10">
                    <button
                      onClick={() => scrollToSection('contact', srv.title)}
                      className={`w-full py-3.5 rounded-full text-xs font-semibold tracking-wider transition-all ${
                        isPopular
                          ? 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/30'
                          : 'bg-white/10 hover:bg-white/20 text-white'
                      }`}
                    >
                      Select Package &rarr;
                    </button>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="col-span-3 bg-[#0c0d18] border border-white/10 rounded-3xl p-10 text-center">
              <h3 className="text-2xl font-bold text-white">Custom Brand Partnerships</h3>
              <p className="text-sm text-gray-400 mt-2 max-w-md mx-auto">
                Currently booking select campaigns and brand partnerships. Get in touch below with your campaign goals.
              </p>
              <button
                onClick={() => scrollToSection('contact')}
                className="mt-6 px-8 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-full text-xs font-semibold tracking-wider transition-all"
              >
                Inquire for Rates
              </button>
            </div>
          )}
        </div>
      </section>

      {/* =========================================================================
          SECTION 6: BOTTOM 3-COLUMN ROW (CTA + TESTIMONIAL + CONTACT)
         ========================================================================= */}
      <section id="contact" className="py-24 px-6 max-w-7xl mx-auto border-t border-white/5">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Card 1: LET'S WORK TOGETHER */}
          <div className="bg-[#0c0d18] border border-white/10 rounded-3xl p-8 flex flex-col justify-between shadow-xl">
            <div className="space-y-4">
              <span className="text-[10px] font-mono uppercase tracking-widest text-indigo-400 font-bold block">
                {nicheProfile.ctaTag}
              </span>
              <h3 className="text-2xl font-bold text-white tracking-tight">
                {nicheProfile.ctaTitle}
              </h3>
              <p className="text-xs text-gray-400 leading-relaxed">
                {nicheProfile.ctaDesc}
              </p>
            </div>

            <div className="mt-8">
              <button 
                onClick={() => scrollToSection('inquiry-form')}
                className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-full text-xs font-semibold tracking-wider transition-all shadow-lg shadow-indigo-600/30 flex items-center justify-center space-x-1.5"
              >
                <span>Get In Touch</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Card 2: TESTIMONIAL */}
          <div className="bg-[#0c0d18] border border-white/10 rounded-3xl p-8 flex flex-col justify-between shadow-xl">
            <div className="space-y-4">
              <div className="w-10 h-10 rounded-xl bg-indigo-600/20 text-indigo-400 flex items-center justify-center font-serif text-2xl font-bold">
                “
              </div>
              <p className="text-xs sm:text-sm text-gray-300 italic leading-relaxed">
                "{nicheProfile.testimonialQuote}"
              </p>
            </div>

            <div className="mt-8 flex items-center space-x-3 pt-4 border-t border-white/10">
              <img 
                src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80" 
                alt={nicheProfile.testimonialAuthor} 
                className="w-10 h-10 rounded-full object-cover border border-white/20"
              />
              <div>
                <div className="text-xs font-bold text-white">{nicheProfile.testimonialAuthor}</div>
                <div className="text-[10px] text-gray-400 uppercase tracking-wider">{nicheProfile.testimonialRole}</div>
              </div>
            </div>
          </div>

          {/* Card 3: FOLLOW ME & DIRECT CONTACT */}
          <div className="bg-[#0c0d18] border border-white/10 rounded-3xl p-8 flex flex-col justify-between shadow-xl">
            <div>
              <span className="text-[10px] font-mono uppercase tracking-widest text-indigo-400 font-bold block mb-4">
                FOLLOW ME
              </span>
              
              {/* Social Icons Row */}
              <div className="flex flex-wrap items-center gap-2.5 text-gray-400 mb-6">
                {socialLinks.length > 0 ? (
                  socialLinks.map((s: any, idx: number) => {
                    const platformName = (s.platform || '').toLowerCase();
                    return (
                      <a 
                        key={idx} 
                        href={s.url || '#'} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="w-10 h-10 rounded-xl bg-white/[0.04] border border-white/10 flex items-center justify-center hover:text-white hover:border-indigo-400/50 transition-all" 
                        title={s.platform || 'Social Link'}
                      >
                        {platformName.includes('youtube') ? <YouTubeIcon /> :
                         platformName.includes('facebook') ? <FacebookIcon /> :
                         platformName.includes('tiktok') ? <TikTokIcon /> :
                         platformName.includes('instagram') ? <InstagramIcon /> :
                         platformName.includes('twitter') || platformName.includes('x') ? <TwitterIcon /> :
                         platformName.includes('linkedin') ? <LinkedinIcon /> :
                         platformName.includes('github') ? <GithubIcon /> :
                         <span className="font-mono text-xs font-bold">{s.platform?.charAt(0) || '✦'}</span>}
                      </a>
                    );
                  })
                ) : (
                  <>
                    <a href={portfolio.github_url || "#"} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-xl bg-white/[0.04] border border-white/10 flex items-center justify-center hover:text-white hover:border-white/30 transition-all" title="GitHub">
                      <GithubIcon />
                    </a>
                    <a href={portfolio.linkedin_url || "#"} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-xl bg-white/[0.04] border border-white/10 flex items-center justify-center hover:text-white hover:border-white/30 transition-all" title="LinkedIn">
                      <LinkedinIcon />
                    </a>
                    <a href={portfolio.twitter_url || "#"} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-xl bg-white/[0.04] border border-white/10 flex items-center justify-center hover:text-white hover:border-white/30 transition-all" title="Twitter / X">
                      <TwitterIcon />
                    </a>
                    <a href={portfolio.instagram_url || "#"} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-xl bg-white/[0.04] border border-white/10 flex items-center justify-center hover:text-white hover:border-white/30 transition-all" title="Instagram">
                      <InstagramIcon />
                    </a>
                  </>
                )}
              </div>

              {/* Direct Info */}
              <div className="space-y-3 text-xs text-gray-400">
                <div className="flex items-center space-x-3">
                  <Mail className="w-4 h-4 text-indigo-400" />
                  <span className="text-gray-300">{portfolio.contact_email || 'hello@falcusmedia.com'}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Phone className="w-4 h-4 text-indigo-400" />
                  <span className="text-gray-300">{portfolio.phone_number || '+1 (555) 123-4567'}</span>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-4 border-t border-white/10 flex items-center justify-between text-[11px] font-mono text-gray-500">
              <span>STATUS</span>
              <span className="text-emerald-400 font-semibold flex items-center">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse mr-1.5" />
                Available for hire
              </span>
            </div>
          </div>

        </div>

        {/* Direct Campaign Inquiry Form Container */}
        <div id="inquiry-form" className="mt-16 bg-[#0c0d18] border border-white/10 rounded-3xl p-8 sm:p-12 shadow-2xl">
          <div className="text-center max-w-xl mx-auto mb-10 space-y-2">
            <span className="text-xs font-mono font-bold uppercase tracking-widest text-indigo-400">
              BOOKING & CONTACT INQUIRY
            </span>
            <h3 className="text-2xl sm:text-4xl font-bold text-white">
              Send a Message to {creatorName}
            </h3>
            <p className="text-xs sm:text-sm text-gray-400">
              Submit your project specifications or sponsorship brief directly to {creatorName}. Responses are typically sent within 24 hours.
            </p>
          </div>

          {inquirySuccess && (
            <div className="mb-8 p-6 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-center space-y-2">
              <CheckCircle className="w-8 h-8 text-emerald-400 mx-auto" />
              <h4 className="font-bold text-lg text-white">Inquiry Sent Successfully!</h4>
              <p className="text-xs text-emerald-300">
                Thank you! Your project details have been delivered to {creatorName} and management.
              </p>
            </div>
          )}

          {inquiryError && (
            <div className="mb-8 p-4 rounded-2xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs text-center font-medium">
              {inquiryError}
            </div>
          )}

          <form onSubmit={handleInquirySubmit} className="space-y-6 max-w-3xl mx-auto">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-gray-300 font-semibold mb-2">
                  Your Name / Organization *
                </label>
                <input 
                  type="text" 
                  required
                  placeholder="e.g. Acme Corp"
                  value={brandName}
                  onChange={(e) => setBrandName(e.target.value)}
                  className="w-full bg-black/40 border border-white/10 rounded-2xl px-4 py-3 text-sm text-white focus:outline-none focus:border-indigo-500 transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-gray-300 font-semibold mb-2">
                  Contact Person *
                </label>
                <input 
                  type="text" 
                  required
                  placeholder="e.g. John Doe"
                  value={contactName}
                  onChange={(e) => setContactName(e.target.value)}
                  className="w-full bg-black/40 border border-white/10 rounded-2xl px-4 py-3 text-sm text-white focus:outline-none focus:border-indigo-500 transition-colors"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-gray-300 font-semibold mb-2">
                  Email Address *
                </label>
                <input 
                  type="email" 
                  required
                  placeholder="john@example.com"
                  value={contactEmail}
                  onChange={(e) => setContactEmail(e.target.value)}
                  className="w-full bg-black/40 border border-white/10 rounded-2xl px-4 py-3 text-sm text-white focus:outline-none focus:border-indigo-500 transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-gray-300 font-semibold mb-2">
                  Estimated Budget *
                </label>
                <select
                  value={budget}
                  onChange={(e) => setBudget(e.target.value)}
                  className="w-full bg-black/40 border border-white/10 rounded-2xl px-4 py-3 text-sm text-white focus:outline-none focus:border-indigo-500 transition-colors"
                >
                  <option value="Under $500">Under $500</option>
                  <option value="$500 - $1,500">$500 - $1,500</option>
                  <option value="$1,500 - $5,000">$1,500 - $5,000</option>
                  <option value="$5,000+">$5,000+ (Flagship Deliverable)</option>
                  <option value="Flexible / Open to Quote">Flexible / Open to Quote</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-gray-300 font-semibold mb-2">
                Project Overview & Requirements *
              </label>
              <textarea 
                required
                rows={4}
                placeholder="Describe your project, deliverable goals, timeline, and any key technical or creative requirements..."
                value={campaignDetails}
                onChange={(e) => setCampaignDetails(e.target.value)}
                className="w-full bg-black/40 border border-white/10 rounded-2xl p-4 text-sm text-white focus:outline-none focus:border-indigo-500 transition-colors"
              />
            </div>

            <button
              type="submit"
              disabled={submittingInquiry}
              className="w-full py-4 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white rounded-full text-xs font-semibold tracking-wider transition-all shadow-xl shadow-indigo-600/30 flex items-center justify-center space-x-2"
            >
              <Send className="w-4 h-4" />
              <span>{submittingInquiry ? 'Sending...' : 'Send Message'}</span>
            </button>
          </form>
        </div>
      </section>

      {/* =========================================================================
          FOOTER (Matches CodeCraft Footer: © 2026 Name. Made for Falcus Media)
         ========================================================================= */}
      <footer className="w-full bg-[#050509] border-t border-white/5 py-8 px-6 text-xs text-gray-500 font-sans">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            &copy; {new Date().getFullYear()} {creatorName}. All rights reserved.
          </div>
          <div>
            Made with <span className="text-rose-500">❤️</span> for <span className="text-gray-300">Falcus Media Agency</span>
          </div>
        </div>
      </footer>

      {/* =========================================================================
          VIDEO / PROJECT PREVIEW MODAL
         ========================================================================= */}
      {activeVideoUrl && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 sm:p-6 animate-in fade-in duration-200">
          <div className="relative w-full max-w-4xl bg-neutral-900 border border-white/20 rounded-3xl overflow-hidden shadow-2xl">
            <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-black/40">
              <span className="text-xs font-mono uppercase tracking-widest text-indigo-400 font-bold">
                Campaign Preview
              </span>
              <button 
                onClick={() => setActiveVideoUrl(null)}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-gray-300 hover:text-white flex items-center justify-center transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="relative aspect-video w-full bg-black">
              <iframe
                src={activeVideoUrl}
                title="Project Preview"
                className="w-full h-full border-0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
