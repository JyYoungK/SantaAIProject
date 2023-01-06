import * as THREE from "three";
import Experience from "../Experience.js";
import GSAP from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger.js";
import ASScroll from "@ashthornton/asscroll";

export default class Controls {
  constructor() {
    this.experience = new Experience();
    this.scene = this.experience.scene;
    this.sizes = this.experience.sizes;
    this.resources = this.experience.resources;
    this.time = this.experience.time;
    this.camera = this.experience.camera;
    this.room = this.experience.world.room.actualRoom;
    this.room.children.forEach((child) => {
      if (child.type === "RectAreaLight") {
        this.rectLight = child;
        this.santaLight = child;
      }
    });
    this.circleFirst = this.experience.world.floor.circleFirst;
    this.circleSecond = this.experience.world.floor.circleSecond;

    GSAP.registerPlugin(ScrollTrigger);

    document.querySelector(".page").style.overflow = "visible";

    if (
      !/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent
      )
    ) {
      this.setSmoothScroll();
    }
    this.setScrollTrigger();
  }

  setupASScroll() {
    const asscroll = new ASScroll({
      ease: 0.5,
      disableRaf: true,
    });

    GSAP.ticker.add(asscroll.update);

    ScrollTrigger.defaults({
      scroller: asscroll.containerElement,
    });

    ScrollTrigger.scrollerProxy(asscroll.containerElement, {
      scrollTop(value) {
        if (arguments.length) {
          asscroll.currentPos = value;
          return;
        }
        return asscroll.currentPos;
      },
      getBoundingClientRect() {
        return {
          top: 0,
          left: 0,
          width: window.innerWidth,
          height: window.innerHeight,
        };
      },
      fixedMarkers: true,
    });

    asscroll.on("update", ScrollTrigger.update);
    ScrollTrigger.addEventListener("refresh", asscroll.resize);

    requestAnimationFrame(() => {
      asscroll.enable({
        newScrollElements: document.querySelectorAll(
          ".gsap-marker-start, .gsap-marker-end, [asscroll]"
        ),
      });
    });
    return asscroll;
  }

  setSmoothScroll() {
    this.asscroll = this.setupASScroll();
  }

  setScrollTrigger() {
    ScrollTrigger.matchMedia({
      //Desktop
      "(min-width: 969px)": () => {
        this.room.scale.set(0.11, 0.11, 0.11);
        this.rectLight.position.set(-73, 5, -85);
        this.rectLight.width = 3.5;
        this.rectLight.height = 3.5;
        // this.santaLight.position.set(-73, 0, -160);
        // this.santaLight.width = 1.7;
        // this.santaLight.height = 1.5;
        this.camera.orthographicCamera.position.set(0, 6.5, 10);
        this.room.position.set(0, 0, 0);

        // Intro section -----------------------------------------
        this.firstMoveTimeline = new GSAP.timeline({
          scrollTrigger: {
            trigger: ".first-move",
            start: "top top",
            end: "bottom bottom",
            scrub: 0.6,
            // markers: true,
            invalidateOnRefresh: true,
          },
        });
        this.firstMoveTimeline.fromTo(
          this.room.position,
          { x: 0, y: 0, z: 0 },
          {
            x: () => {
              return this.sizes.width * 0.003;
            },
            z: () => {
              return 8;
            },
          }
        );

        // Santa House section -----------------------------------------
        this.secondMoveTimeline = new GSAP.timeline({
          scrollTrigger: {
            trigger: ".second-move",
            start: "top top",
            end: "bottom bottom",
            scrub: 0.6,
            invalidateOnRefresh: true,
          },
        }).to(this.camera.orthographicCamera.position, {
          x: 2.7,
          z: 1,
        });
      },

      // Mobile
      "(max-width: 968px)": () => {
        // console.log("fired mobile");

        // Resets
        this.room.scale.set(0.07, 0.07, 0.07);
        this.room.position.set(0, 0, 0);
        this.rectLight.position.set(0, 0, 0);
        this.rectLight.width = 0.3;
        this.rectLight.height = 0.4;
        this.camera.orthographicCamera.position.set(0, 6.5, 10);

        // First section -----------------------------------------
        this.firstMoveTimeline = new GSAP.timeline({
          scrollTrigger: {
            trigger: ".first-move",
            start: "top top",
            end: "bottom bottom",
            scrub: 0.6,
            // markers: true,
            invalidateOnRefresh: true,
          },
        });
        this.firstMoveTimeline.fromTo(
          this.room.position,
          { x: 0, y: 0, z: 0 },
          {
            x: () => {
              return this.sizes.width * 0.01;
            },
            z: () => {
              return 4;
            },
          }
        );

        // Santa House section -----------------------------------------
        this.secondMoveTimeline = new GSAP.timeline({
          scrollTrigger: {
            trigger: ".second-move",
            start: "top top",
            end: "bottom bottom",
            scrub: 0.6,
            invalidateOnRefresh: true,
          },
        }).to(this.camera.orthographicCamera.position, {
          x: 1.9,
          z: 0.005,
        });
      },

      // all
      all: () => {
        this.sections = document.querySelectorAll(".section");
        this.sections.forEach((section) => {
          this.progressWrapper = section.querySelector(".progress-wrapper");
          this.progressBar = section.querySelector(".progress-bar");

          if (section.classList.contains("right")) {
            GSAP.to(section, {
              borderTopLeftRadius: 10,
              scrollTrigger: {
                trigger: section,
                start: "top bottom",
                end: "top top",
                scrub: 0.6,
              },
            });
            GSAP.to(section, {
              borderBottomLeftRadius: 700,
              scrollTrigger: {
                trigger: section,
                start: "bottom bottom",
                end: "bottom top",
                scrub: 0.6,
              },
            });
          } else {
            GSAP.to(section, {
              borderTopRightRadius: 10,
              scrollTrigger: {
                trigger: section,
                start: "top bottom",
                end: "top top",
                scrub: 0.6,
              },
            });
            GSAP.to(section, {
              scrollTrigger: {
                trigger: section,
                start: "bottom bottom",
                end: "bottom top",
                scrub: 0.6,
              },
            });
          }
          GSAP.from(this.progressBar, {
            scaleY: 0,
            scrollTrigger: {
              trigger: section,
              start: "top top",
              end: "bottom bottom",
              scrub: 0.4,
              pin: this.progressWrapper,
              pinSpacing: false,
            },
          });
        });

        // All animations
        // First section -----------------------------------------
        this.firstCircle = new GSAP.timeline({
          scrollTrigger: {
            trigger: ".first-move",
            start: "top top",
            end: "bottom bottom",
            scrub: 0.6,
          },
        }).to(this.circleFirst.scale, {
          x: 3,
          y: 3,
          z: 3,
        });

        // Second section -----------------------------------------
        this.secondCircle = new GSAP.timeline({
          scrollTrigger: {
            trigger: ".second-move",
            start: "top top",
            end: "bottom bottom",
            scrub: 0.6,
          },
        }).to(this.circleSecond.scale, {
          x: 3,
          y: 3,
          z: 3,
        });

        // Mini Platform Animations
        this.secondPartTimeline = new GSAP.timeline({
          scrollTrigger: {
            trigger: "floor-move",
            start: "center center",
          },
        });

        this.room.children.forEach((child) => {
          if (child.name === "Mailbox") {
            this.mail = GSAP.to(child.scale, {
              x: 1,
              y: 1,
              z: 1,
              duration: 0.3,
            });
          }
          if (child.name === "Floor1") {
            this.first = GSAP.to(child.scale, {
              x: 1,
              y: 1,
              z: 1,
              duration: 0.05,
            });
          }
          if (child.name === "Floor2") {
            this.second = GSAP.to(child.scale, {
              x: 1,
              y: 1,
              z: 1,
              duration: 0.05,
            });
          }
          if (child.name === "Floor3") {
            this.third = GSAP.to(child.scale, {
              x: 1,
              y: 1,
              z: 1,
              duration: 0.05,
            });
          }
          if (child.name === "Floor4") {
            this.fourth = GSAP.to(child.scale, {
              x: 1,
              y: 1,
              z: 1,
              duration: 0.05,
            });
          }
          if (child.name === "Floor5") {
            this.fifth = GSAP.to(child.scale, {
              x: 1,
              y: 1,
              z: 1,
              duration: 0.05,
            });
          }
          if (child.name === "Floor6") {
            this.sixth = GSAP.to(child.scale, {
              x: 1,
              y: 1,
              z: 1,
              duration: 0.05,
            });
          }
          if (child.name === "Floor7") {
            this.seventh = GSAP.to(child.scale, {
              x: 1,
              y: 1,
              z: 1,
              duration: 0.05,
            });
          }
          if (child.name === "Floor8") {
            this.eighth = GSAP.to(child.scale, {
              x: 1,
              y: 1,
              z: 1,
              duration: 0.05,
            });
          }
          if (child.name === "Floor9") {
            this.ninth = GSAP.to(child.scale, {
              x: 1,
              y: 1,
              z: 1,
              duration: 0.05,
            });
          }
          if (child.name === "Floor10") {
            this.tenth = GSAP.to(child.scale, {
              x: 1,
              y: 1,
              z: 1,
              duration: 0.05,
            });
          }
          if (child.name === "Floor11") {
            this.elventh = GSAP.to(child.scale, {
              x: 1,
              y: 1,
              z: 1,
              duration: 0.05,
            });
          }
          if (child.name === "Floor12") {
            this.twelveth = GSAP.to(child.scale, {
              x: 1,
              y: 1,
              z: 1,
              duration: 0.05,
            });
          }
          if (child.name === "Floor13") {
            this.thirteenth = GSAP.to(child.scale, {
              x: 1,
              y: 1,
              z: 1,
              duration: 0.05,
            });
          }
          if (child.name === "Floor14") {
            this.fourteenth = GSAP.to(child.scale, {
              x: 1,
              y: 1,
              z: 1,
              duration: 0.05,
            });
          }
          if (child.name === "Floor15") {
            this.fifteenth = GSAP.to(child.scale, {
              x: 1,
              y: 1,
              z: 1,
              duration: 0.05,
            });
          }
          if (child.name === "Floor16") {
            this.sixteenth = GSAP.to(child.scale, {
              x: 1,
              y: 1,
              z: 1,
              duration: 0.05,
            });
          }
          if (child.name === "Floor17") {
            this.seventeenth = GSAP.to(child.scale, {
              x: 1,
              y: 1,
              z: 1,
              duration: 0.05,
            });
          }
          if (child.name === "Floor18") {
            this.eighteenth = GSAP.to(child.scale, {
              x: 1,
              y: 1,
              z: 1,
              duration: 0.05,
            });
          }
          if (child.name === "Floor19") {
            this.nineteenth = GSAP.to(child.scale, {
              x: 1,
              y: 1,
              z: 1,
              duration: 0.05,
            });
          }
          if (child.name === "Floor20") {
            this.twenty = GSAP.to(child.scale, {
              x: 1,
              y: 1,
              z: 1,
              duration: 0.05,
            });
          }
          if (child.name === "Floor21") {
            this.twentyone = GSAP.to(child.scale, {
              x: 1,
              y: 1,
              z: 1,
              duration: 0.05,
            });
          }
          if (child.name === "Floor22") {
            this.twentytwo = GSAP.to(child.scale, {
              x: 1,
              y: 1,
              z: 1,
              duration: 0.05,
            });
          }
          if (child.name === "Floor23") {
            this.twentythree = GSAP.to(child.scale, {
              x: 1,
              y: 1,
              z: 1,
              duration: 0.05,
            });
          }
          if (child.name === "Floor24") {
            this.twentyfour = GSAP.to(child.scale, {
              x: 1,
              y: 1,
              z: 1,
              duration: 0.05,
            });
          }
          if (child.name === "Floor25") {
            this.twentyfive = GSAP.to(child.scale, {
              x: 1,
              y: 1,
              z: 1,
              duration: 0.05,
            });
          }
          if (child.name === "Floor26") {
            this.twentysix = GSAP.to(child.scale, {
              x: 1,
              y: 1,
              z: 1,
              duration: 0.05,
            });
          }
          if (child.name === "Floor27") {
            this.twentyseven = GSAP.to(child.scale, {
              x: 1,
              y: 1,
              z: 1,
              duration: 0.05,
            });
          }
          if (child.name === "Floor28") {
            this.twentyeigth = GSAP.to(child.scale, {
              x: 1,
              y: 1,
              z: 1,
              duration: 0.05,
            });
          }
          if (child.name === "Floor29") {
            this.twentynine = GSAP.to(child.scale, {
              x: 1,
              y: 1,
              z: 1,
              duration: 0.05,
            });
          }
          if (child.name === "Floor30") {
            this.thirty = GSAP.to(child.scale, {
              x: 1,
              y: 1,
              z: 1,
              duration: 0.05,
            });
          }
        });
        this.secondPartTimeline.add(this.mail, "=0.1");
        this.secondPartTimeline.add(this.first, "=0.2");
        this.secondPartTimeline.add(this.second, "=0.21");
        this.secondPartTimeline.add(this.third, "=0.22");
        this.secondPartTimeline.add(this.fourth, "=0.23");
        this.secondPartTimeline.add(this.fifth, "=0.24");
        this.secondPartTimeline.add(this.sixth, "=0.25");
        this.secondPartTimeline.add(this.seventh, "=0.26");
        this.secondPartTimeline.add(this.eighth, "=0.27");
        this.secondPartTimeline.add(this.ninth, "=0.28");
        this.secondPartTimeline.add(this.tenth, "=0.29");
        this.secondPartTimeline.add(this.elventh, "=0.3");
        this.secondPartTimeline.add(this.twelveth, "=0.31");
        this.secondPartTimeline.add(this.thirteenth, "=0.32");
        this.secondPartTimeline.add(this.fourteenth, "=0.33");
        this.secondPartTimeline.add(this.fifteenth, "=0.34");
        this.secondPartTimeline.add(this.sixteenth, "=0.35");
        this.secondPartTimeline.add(this.seventeenth, "=0.36");
        this.secondPartTimeline.add(this.eighteenth, "=0.37");
        this.secondPartTimeline.add(this.nineteenth, "=0.38");
        this.secondPartTimeline.add(this.twenty, "=0.39");
        this.secondPartTimeline.add(this.twentyone, "=0.4");
        this.secondPartTimeline.add(this.twentytwo, "=0.41");
        this.secondPartTimeline.add(this.twentythree, "=0.42");
        this.secondPartTimeline.add(this.twentyfour, "=0.43");
        this.secondPartTimeline.add(this.twentyfive, "=0.44");
        this.secondPartTimeline.add(this.twentysix, "=0.45");
        this.secondPartTimeline.add(this.twentyseven, "=0.46");
        this.secondPartTimeline.add(this.twentyeigth, "=0.47");
        this.secondPartTimeline.add(this.twentynine, "=0.48");
        this.secondPartTimeline.add(this.thirty, "=0.49");
      },
    });
  }
  resize() {}

  update() {}
}
