export type PropsType = {
  ref: GSAPTweenTarget;
  fromVars: GSAPTweenVars;
  toVars: GSAPTweenVars;
};

const initalClipPaths = [
    "polygon(0% 100%,50% 100%,50% 100%,0% 100%)",
    "polygon(25% 0%,100% 0%,75% 0%,25% 0%)",
    "polygon(25% 100%,75% 100%,75% 100%,0% 100%)",
    "polygon(50% 0%,100% 0%,100% 0%,50% 0%)"
]
const finalClipPaths = [
    "polygon(0% 0%,100% 0%,50% 100%,0% 100%)",
    "polygon(25% 0%,100% 0%,50% 100%,0% 100%)",
    "polygon(50% 0%,100% 0%,75% 100%,0% 100%)",
    "polygon(50% 0%,100% 0%,100% 100%,0% 100%)"
]

export const buildAnimationProps = (
  scrollWatcherRef: React.MutableRefObject<any[]>,
  headingRefs: React.MutableRefObject<any[]>,
  overlayRef: React.MutableRefObject<any[]>,
  foliageRef: React.MutableRefObject<any[]>,
  layer2Ref: React.MutableRefObject<any>,
  layer3Ref: React.MutableRefObject<any>,
  svgRef: React.MutableRefObject<any>,
  mapRef: React.MutableRefObject<any>,
  swiperRef: React.MutableRefObject<any>,
  bgRefs: React.MutableRefObject<any>,
  recentRefs: React.MutableRefObject<any[]>
): PropsType[] => {
  const temp: PropsType[] = recentRefs.current.map((ref) => ({
    ref,
    fromVars: { opacity: 0 },
    toVars: {
      opacity: 1,
      duration: 0.25,
      scrollTrigger: {
        trigger: ref,
        start: 'top 60%',
      },
    },
  }));

  return [
      { 
        ref: headingRefs.current[0], 
        fromVars: { top: '100px', opacity: 0 }, 
        toVars: { top: '0px', opacity: 1, duration: 2, scrollTrigger: { trigger: scrollWatcherRef.current[0], start: '-10px top' } } 
      },
      { 
        ref: svgRef.current, 
        fromVars: { strokeDashoffset: 400 }, 
        toVars: { strokeDashoffset: 0, duration: 2, delay: 2, scrollTrigger: { trigger: scrollWatcherRef.current[0], start: '-10px top' } } 
      },
      { 
        ref: foliageRef.current[0], 
        fromVars: {}, 
        toVars: { scale: 2, scrollTrigger: { trigger: scrollWatcherRef.current[0], start: '100% top', end: '125% top', scrub: true } } 
      },
      { 
        ref: headingRefs.current[1], 
        fromVars: { opacity: 0 }, 
        toVars: { opacity: 1, ease: 'power1.inOut', 
          scrollTrigger: { trigger: scrollWatcherRef.current[0], start: '120% top', end: '140% top', toggleActions: 'play none none reverse' } 
        } 
      },
      { 
        ref: overlayRef.current[0], 
        fromVars: {}, 
        toVars: { backgroundColor: 'rgba(0,0,0,0)', ease: 'power1.inOut', 
          scrollTrigger: { trigger: scrollWatcherRef.current[0], start: '100% top', end: '140% top', scrub: true, toggleActions: 'play none none reverse' } 
        } 
      },
      {
        ref: foliageRef.current[0], 
        fromVars: {}, 
        toVars: { opacity: 0, ease: 'power1.inOut', 
          scrollTrigger: { trigger: scrollWatcherRef.current[0], start: '190% top', end: '200% top', toggleActions: 'play none none reverse' } 
        } 
      },
      {
        ref: layer2Ref.current, 
        fromVars: { width: '100%' }, 
        toVars: { width: '0', ease: 'power1.inOut', 
          scrollTrigger: { trigger: scrollWatcherRef.current[0], start: '150% top', end: '200% top', toggleActions: 'play none none reverse', scrub: true } 
        } 
      },
      { 
        ref: headingRefs.current[2], 
        fromVars: { opacity: 0 }, 
        toVars: { opacity: 1, ease: 'power1.inOut', 
          scrollTrigger: { trigger: scrollWatcherRef.current[0], start: '200% top', end: '225% top', toggleActions: 'play none none reverse' } 
        } 
      },
      { 
        ref: foliageRef.current[1], 
        fromVars: {}, 
        toVars: { scale: 1, ease: 'power1.inOut', 
          scrollTrigger: { trigger: scrollWatcherRef.current[0], start: '220% top', end: '245% top', scrub: true } 
        } 
      },
      { 
        ref: overlayRef.current[1], 
        fromVars: {}, 
        toVars: { backgroundColor: 'rgba(0,0,0,0.7)', ease: 'power1.inOut', 
          scrollTrigger: { trigger: scrollWatcherRef.current[0], start: '225% top', end: '250% top', scrub: true, toggleActions: 'play none none reverse' } 
        } 
      },
      { 
        ref: layer3Ref.current, 
        fromVars: { width: '100%' }, 
        toVars: { width: '0', ease: 'power1.inOut', 
          scrollTrigger: { trigger: scrollWatcherRef.current[0], start: '250% top', end: '300% top', toggleActions: 'play none none reverse', scrub: true } 
        } 
      },
      { 
        ref: headingRefs.current[3], 
        fromVars: { opacity: 0 }, 
        toVars: { opacity: 1, ease: 'power1.inOut', 
          scrollTrigger: { trigger: scrollWatcherRef.current[0], start: '300% top', end: '325% top', toggleActions: 'play none none reverse' } 
        } 
      },
      { 
        ref: headingRefs.current[4], 
        fromVars: { opacity: 0 }, 
        toVars: { opacity: 1, duration: 1, 
          scrollTrigger: { trigger: scrollWatcherRef.current[1], start: '-20% top' }
        } 
      },
      { 
        ref: mapRef.current, 
        fromVars: { height: '0' }, 
        toVars: { height: '100%', duration: 1, 
          scrollTrigger: { trigger: scrollWatcherRef.current[1], start: '-20% top' } 
        } 
      },
      { 
        ref: headingRefs.current[5], 
        fromVars: { opacity: 0 }, 
        toVars: { opacity: 1, duration: 1, 
        scrollTrigger: { trigger: scrollWatcherRef.current[2], start: '-40% top' } 
       } 
      },
      { 
        ref: swiperRef.current, 
        fromVars: { opacity: 1 }, 
        toVars: { opacity: 0, zIndex: -10, duration: 1, scrollTrigger: { trigger: scrollWatcherRef.current[2], start: '-20% top' } 
        } 
      },
      { 
        ref: headingRefs.current[6], 
        fromVars: { opacity: 0 }, 
        toVars: { opacity: 1, duration: 1, 
        scrollTrigger: { trigger: scrollWatcherRef.current[3], start: '-10% top' } 
        } 
      },
      ...temp,
      {
        ref: bgRefs.current,
        fromVars: {clipPath: (index) => initalClipPaths[index]},
        toVars: { clipPath: (index) => finalClipPaths[index], duration: 0.25, stagger: 0.1, 
          scrollTrigger: { trigger: scrollWatcherRef.current[4],start: 'top top',end: 'center top',toggleActions: 'play reverse play none'}
        }
      }
    ];
};
