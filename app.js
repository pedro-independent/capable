


// Barba JS //

function resetWebflow(data) {
    let dom = $(new DOMParser().parseFromString(data.next.html, "text/html")).find("html");

    // Reset Webflow interactions
    $("html").attr("data-wf-page", dom.attr("data-wf-page"));
    window.Webflow && window.Webflow.destroy();
    window.Webflow && window.Webflow.ready();
    window.Webflow && window.Webflow.require("ix2").init();

    // Reset w--current class
    $(".w--current").removeClass("w--current");
    $("a").each(function () {
        if ($(this).attr("href") === window.location.pathname) {
            $(this).addClass("w--current");
        }
    });

    // Reset scripts
    dom.find("[data-barba-script]").each(function () {
        let codeString = $(this).text();
        if (codeString.includes("DOMContentLoaded")) {
            console.log('THIS IS CODE STRING BEFORE REPLACING IT', codeString);
            let newCodeString = codeString.replace(/window\.addEventListener\("DOMContentLoaded",\s*\(\s*event\s*\)\s*=>\s*{\s*/, "");
            codeString = newCodeString.replace(/\s*}\s*\);\s*$/, "");
            console.log('THIS IS CODE STRING AFTER replacements', codeString);
        }
        let script = document.createElement("script");
        script.type = "text/javascript";
        if ($(this).attr("src")) script.src = $(this).attr("src");
        console.log('THIS IS CODE STRING', codeString)
        script.text = codeString;
        document.body.appendChild(script).remove();
    });
}

barba.hooks.enter((data) => {
    gsap.set(data.next.container, {
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        x: "100vh"  // Start next page off-screen to the right
    });
});

barba.hooks.after((data) => {
    gsap.set(data.next.container, { position: "relative" });
    $(window).scrollTop(0);
    // resetWebflow(data);

    // 🔹 Trigger Hero Animation on New Page
    // animateHero();
    RunCohorttablesCode();
    RunCountup();
    
});

barba.init({
    views: [
        {
            namespace: 'home',
            beforeEnter(data) {
                // Code to run before entering this view (e.g., setup animations)
                console.log('Entering home page');

                RunFirst();
                HomeLoader();
               

                initModalBasic();
                FooterCode();
               
                RebootWebflowFunctions();

            },
            afterEnter(data) {
                homeInit();
                // Code to run right after entering this view
            },
            beforeLeave(data) {
                // Clean up before leaving the page (e.g., destroy listeners)
            }
        },
        {
            namespace: 'model',
            beforeEnter(data) {
                console.log('Entering model page');
                RunFirst();               
                ModelInit();
                initModalBasic();
                FooterCode();
                animateStandardHero();
                RebootWebflowFunctions();

            },
            afteEnter()
            {
                
            }
        },
        {
            namespace: 'approach',
            beforeEnter(data) {
                console.log('Entering approach page');
                RunFirst();

                initModalBasic();
                FooterCode();
                animateStandardHero();
                RebootWebflowFunctions();

            }
        },
        {
            namespace: 'impact',
            beforeEnter(data) {
                console.log('Entering impact page');
                RunFirst();
                ImpactInit();
                initModalBasic();
                FooterCode();
                animateStandardHero();
                RebootWebflowFunctions();

            },
            afteEnter()
            {
                
            }
        },
        {
            namespace: 'blog',
            beforeEnter(data) {
                console.log('Entering blog page');
                RunFirst();

                initModalBasic();
                FooterCode();
                animateStandardHero();
                RebootWebflowFunctions();

            }
        },
        {
            namespace: 'investment',
            beforeEnter(data) {
                console.log('Entering investment page');
                RunFirst();

                initModalBasic();
                FooterCode();
                animateStandardHero();
                RebootWebflowFunctions();

            },
            afteEnter()
            {
                InvestmentInit();
            }
        },
        {
            namespace: 'people',
            beforeEnter(data) {
                console.log('Entering people page');
                RunFirst();

                initModalBasic();
                FooterCode();
                animateStandardHero();
                RebootWebflowFunctions();

            },
            afteEnter()
            {
                PeopletInit();
            }
        },
        {
            namespace: 'bloppost',
            beforeEnter(data) {
                console.log('Entering bloppost page');
                RunFirst();

                initModalBasic();
                FooterCode();
                animateStandardHero();
                RebootWebflowFunctions();

            }
        }
    ],
    // preventRunning: true,
    transitions: [
        {
            sync: true,
            enter(data) {
                let tl = gsap.timeline({ defaults: { duration: 1, ease: "power2.out" } });

                // Move the current page to the left while fading out
                tl.to(data.current.container, { x: "-100vw", opacity: 0.5 });

                // Slide the new page in from the right
                tl.to(data.next.container, { x: "0vw" }, "<");

                return tl;
            }
        }
    ]
});



let hasVisited = false;
function HomeLoader() {

    // Create the hero animation timeline but keep it paused
    let heroTl = createHeroAnimation();
    heroTl.pause(); // Ensure it's paused initially

    if (!hasVisited) {
        // First-time visitor: Show the loader, then play hero animation
        hasVisited = true;
        initLoaderThreeSteps(heroTl);

    } else {
        // Returning visitor: Skip loader, play hero animation immediately
        heroTl.play();
    }

}

function homeInit() {

    console.log("home code entered");

    //Map Location Modal
    if ($(".map-location").length) {
        $(".map-location").on("mouseenter", function (e) {
            let linkName = $(this).attr("location-name");
            $("div.location").text(linkName);
        });

        $('.map-location').on("mouseleave", function (e) {
            $("div.location").text('Hover a Location');
        });
    }
    //New Card Animation
    const cards = gsap.utils.toArray(".client-card");
    const centerIndex = 7;

    // Ensure perspective for 3D depth
    document.querySelector(".u-grid-column-5").style.perspective = "1000px";

    // Set initial state
    gsap.set(cards, {
        opacity: 0,
        scale: 0,
        rotateY: () => gsap.utils.random(-45, 45),
        rotateX: () => gsap.utils.random(-20, 20),
        z: -200,
    });

    // Use a ScrollTrigger-based context to allow repeatable animation
    ScrollTrigger.create({
        trigger: ".u-grid-column-5",
        start: "top 70%",
        end: "bottom top",
        onEnter: () => animateCards(),
        onLeaveBack: () => animateCards(true),
    });

    function animateCards(reverse = false) {
        const tl = gsap.timeline();

        // Animate center card first
        tl.to(cards[centerIndex], {
            opacity: 1,
            scale: 1.2,
            rotateY: 0,
            rotateX: 0,
            z: 0,
            ease: "power3.out",
            duration: 0.8,
        });

        // Then bring in the rest (including scaling center card back to 1)
        tl.to(cards, {
            opacity: 1,
            scale: 1,
            rotateY: 0,
            rotateX: 0,
            z: 0,
            ease: "power2.out",
            duration: 0.9,
            stagger: {
                amount: 1.2,
                grid: [3, 5],
                from: centerIndex,
            }
        }, "-=0.4");

        if (reverse) {
            tl.reverse(0);
        }
    }
    // Scroll page overlap effect






    //Full Width Hero Text
    function setFullWidthFontSize() {
        $(".text-wrapper").each(function () {
            let parentWidth = $(this).width();
            let child = $(this).children();

            let fontSize = 0.5;
            child.css("font-size", fontSize + "cqw");
            while (child.width() < parentWidth) {
                fontSize += 0.1;
                child.css("font-size", fontSize + "cqw");
            }
            fontSize -= 0.1;
            child.css("font-size", fontSize + "cqw");
        });
    }

    function isDesktop() {
        return window.matchMedia("(min-width: 992px)").matches; // Adjust if needed
    }

    if (isDesktop()) {
        setFullWidthFontSize();
        document.fonts.ready.then(setFullWidthFontSize);
    }

    //FAB Scrolling Sections
    gsap.registerPlugin(ScrollTrigger);

    [
        { section: "#our-model", fab: ".fab_wrap.is-01" },
        { section: "#our-approach", fab: ".fab_wrap.is-02" },
        { section: "#our-impact", fab: ".fab_wrap.is-03" },
        { section: "#our-blog", fab: ".fab_wrap.is-04" },
    ].forEach(({ section, fab }) => {
        const fabEl = document.querySelector(fab);
        const timelineEl = fabEl.querySelector(".timeline");

        gsap.set(fabEl, { scale: 0.7, yPercent: 200 });

        gsap.to(fabEl, {
            scrollTrigger: {
                trigger: section,
                start: "top center",
                end: "bottom center",
                scrub: true,
            },
            scale: 1,
            yPercent: 0,
            ease: "power2.out",
        });

        gsap.to(fabEl, {
            scrollTrigger: {
                trigger: section,
                start: "bottom center",
                end: "bottom bottom",
                scrub: true,
            },
            scale: 0.7,
            yPercent: 200,
            ease: "power2.in",
        });

        gsap.fromTo(timelineEl,
            { width: "0%" },
            {
                width: "100%",
                scrollTrigger: {
                    trigger: section,
                    start: "top center",
                    end: "bottom center",
                    scrub: true,
                }
            });
    });




    //*******************************************//
    window.addEventListener("load", () => {
        ScrollTrigger.refresh();
    });


    document.querySelectorAll("[data-scroll-overlap='true']").forEach(section => {
        if (section.dataset.scriptInitialized) return;
        section.dataset.scriptInitialized = "true";

        let previousSection = section.previousElementSibling;
        if (!previousSection) {
            console.warn("No previous section found for", section);
            return;
        }
        gsap.timeline({
            scrollTrigger: {
                trigger: section,
                start: () => section.offsetHeight < window.innerHeight ? "bottom " + window.innerHeight : "top " + window.innerHeight,
                end: "top top",
                scrub: true
            }
        }).to(previousSection, { y: "30vh", ease: "none" });
    });

    // Initialize Button Character Stagger Animation

    initButtonCharacterStagger();




    // Scrub Text 

    document.querySelectorAll(".text_1_wrap").forEach(function (element) {
        if (element.dataset.scriptInitialized) return;
        element.dataset.scriptInitialized = "true";

        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: element,
                start: "top center",
                end: "bottom center",
                scrub: true,
            },
        });
        tl.from(typeSplit.words, { "--text_1_line-width": "0%", stagger: 0.5, ease: "none" });
    });

    
//Swiper code
// document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll(".slider_2_wrap").forEach((wrap) => {
    if (wrap.dataset.scriptInitialized) return;
    wrap.dataset.scriptInitialized = "true";
    const cmsWrap = wrap.querySelector(".slider_2_cms_wrap");
    const bulletWrap = wrap.querySelector(".slider_2_bullet_wrap");
    const bullets = bulletWrap ? bulletWrap.querySelectorAll(".slider_2_bullet_item") : [];
    if (!cmsWrap || !bulletWrap || bullets.length === 0) {
      console.warn("Missing required elements for Swiper in:", wrap);
      return;
    }

    const swiper = new Swiper(cmsWrap, {
      slidesPerView: "auto",
      followFinger: true,
      freeMode: false,
      slideToClickedSlide: false,
      centeredSlides: false,
      autoHeight: false,
      speed: 600,
      initialSlide: 0,
      mousewheel: { forceToAxis: true },
      keyboard: { enabled: true, onlyInViewport: true },
      navigation: {
        nextEl: wrap.querySelector(".slider_2_btn_element.is-next"),
        prevEl: wrap.querySelector(".slider_2_btn_element.is-prev"),
      },
      scrollbar: {
        el: wrap.querySelector(".slider_2_draggable_wrap"),
        draggable: true,
        dragClass: "slider_2_draggable_handle",
        snapOnRelease: true,
      },
      slideActiveClass: "is-active",
      slideDuplicateActiveClass: "is-active",
      on: {
  init: function () {
    animateSlide(this.slides[this.activeIndex]);
  },
  slideChangeTransitionEnd: function () {
    animateSlide(this.slides[this.activeIndex]);
  },
}
    });

    const setInitialActive = () => {
      bullets.forEach(bullet => bullet.classList.remove("is-active"));
      if (bullets.length > 0) bullets[0].classList.add("is-active");
      swiper.slideTo(0, 0);
    };

    setInitialActive();

    bullets.forEach((bullet, index) => {
      bullet.dataset.slideIndex = index;
      bullet.addEventListener("click", function () {
        const slideIndex = parseInt(this.dataset.slideIndex, 10);
        swiper.slideTo(slideIndex);
        bullets.forEach((b) => b.classList.remove("is-active"));
        this.classList.add("is-active");
      });
    });

    swiper.on("slideChange", () => {
      const activeIndex = swiper.realIndex;
      bullets.forEach((bullet, i) => {
        bullet.classList.toggle("is-active", i === activeIndex);
      });
    });

    // 🔥 GSAP animation function per slide
function animateSlide(slideEl) {
  const tl = gsap.timeline();

  // Animate split text by character (titles)
  $(slideEl)
    .find("[data-split]")
    .each(function () {
      let text = new SplitType(this, { types: "chars" });
      tl.from(
        text.chars,
        {
          yPercent: 100,
          stagger: 0.05,
          duration: 0.6,
          ease: "power2.out",
          overwrite: "auto",
        },
        "-=0.5"
      );
    });

  // Animate split lines (paragraphs or multiline text)
  $(slideEl)
    .find("[data-split-lines]")
    .each(function () {
      let text = new SplitType(this, { types: "lines" });

      // Wrap each line to allow clipping
      $(text.lines).wrap("<div class='line-wrapper'></div>");

      tl.from(
        text.lines,
        {
          yPercent: 100,
          stagger: 0.1,
          duration: 0.8,
          ease: "power2.out",
          overwrite: "auto",
        },
        "-=1"
      );
    });

  // Animate background scale-in
  $(slideEl)
    .find("[data-scale-bg]")
    .each(function () {
      tl.fromTo(
        this,
        { scale: 1.7 },
        { scale: 1, duration: 2, ease: "power2.out" },
        "<"
      );
    });
}
  });
// });

// RunCountup();

};


function ModelInit() {

    //Map Location Modal
    $(".map-location").on("mouseenter", function (e) {
        let linkName = $(this).attr("location-name");
        $("div.location").text(linkName);
    });

    $('.map-location').on("mouseleave", function (e) {
        $("div.location").text('Hover a Location');
    });


    // Initialize Button Character Stagger Animation
    document.addEventListener('DOMContentLoaded', () => {
        initButtonCharacterStagger();
    });

    // Circle Timeline
    // set variables
    let circleParent = $(".circle");
    let circleItem = $(".circle_item");
    let itemLength = circleItem.length;
    // 360 divided by number of items
    let rotateAmount = 360 / itemLength;
    let previousIndex = 0;
    let currentRotation = 0;

    function makeItemActive(item) {
        let itemIndex = item.index();
        let difference = itemIndex - previousIndex;
        let clockwiseRotation = (difference + itemLength) % itemLength;
        let counterclockwiseRotation = (itemLength - difference) % itemLength;
        let isClockwise = clockwiseRotation <= counterclockwiseRotation;
        let amount = (isClockwise ? clockwiseRotation : -counterclockwiseRotation) * rotateAmount;
        let total = currentRotation + amount;

        circleItem.removeClass("current");
        item.addClass("current");
        circleParent.css("transform", `rotate(${total * -1}deg)`);

        previousIndex = itemIndex;
        currentRotation = total;
    }
    makeItemActive(circleItem.first());

    // Set each item's rotation
    circleItem.each(function (index) {
        let thisItem = $(this);
        let childLink = $(this).find(".circle_link");
        let itemRotation = rotateAmount * index;
        $(this).css("transform", `rotate(${itemRotation}deg)`);

        // slide parent circle to rotation of the clicked link
        childLink.on("click", function () {
            makeItemActive(thisItem);
        });
    });

    // reveal circle after item rotations are set
    circleParent.css("opacity", "1.0");


    //Tim's secret
    window.addEventListener("DOMContentLoaded", (event) => {
        $("[data-gsap-hide]").css("visibility", "visible");
    });

}


function ImpactInit() {
    // Ripple Effect
    const pulseSets = [
        [".pulse-peach", ".pulse-peach-ripple"],
        [".pulse-blue", ".pulse-blue-ripple"],
        [".pulse-green", ".pulse-green-ripple"],
        [".pulse-gold", ".pulse-gold-ripple"],
        [".Circle"]
    ];

    // Set all to initial scale 0.9, full opacity, and transform origin at center
    pulseSets.flat().forEach(selector => {
        gsap.set(selector, { scale: 0.9, opacity: 1, transformOrigin: "center" });
    });

    pulseSets.forEach((set, i) => {
        const tl = gsap.timeline({ repeat: -1, yoyo: true, delay: i * 0.4 });

        set.forEach((cls, j) => {
            tl.to(cls, {
                scale: 1,
                opacity: 0.6,
                duration: 2.5,
                ease: "power1.inOut"
            }, j * 0.01);
        });
    });

    // //Map Location Modal
    // $(".map-location").on("mouseenter", function (e) {
    //   let linkName = $(this).attr("location-name");
    //   $("div.location").text(linkName);
    // });

    // $('.map-location').on("mouseleave", function (e) {
    //   $("div.location").text('Hover a Location');
    // });

    //Charts JS
    $(".chart_wrap").each(function () {
        let canvas = $(this).find("canvas");
        let tooltipColors = $(this).find(".chart_tooltip_colors");
        let items = $(this).find(".chart_item");

        let labelsArray = [];
        let valuesArray = [];
        let valuesArray2 = [];
        let valuesArray3 = [];
        let valuesArray4 = [];

        items.each(function () {
            labelsArray.push($(this).attr("data-label"));
            valuesArray.push(parseFloat($(this).attr("data-value-1")));
            valuesArray2.push(parseFloat($(this).attr("data-value-2")));
            valuesArray3.push(parseFloat($(this).attr("data-value-3")));
            valuesArray4.push(parseFloat($(this).attr("data-value-4")));
        });

        let brand1 = $("html").css("--brand-gold");
        let brand2 = $("html").css("--brand-blue");
        let brand3 = $("html").css("--brand-peach");
        let brand4 = $("html").css("--brand-green");

        let chart = new Chart(canvas[0], {
            type: 'line',
            data: {
                labels: labelsArray,
                datasets: [{
                    label: 'Cohort 2024-2025',
                    data: valuesArray,
                    borderColor: [brand1],
                    backgroundColor: [brand1],
                }, {
                    label: 'Cohort 2022-2023',
                    data: valuesArray2,
                    borderColor: [brand2],
                    backgroundColor: [brand2],
                }, {
                    label: 'Cohort 2020-2021',
                    data: valuesArray3,
                    borderColor: [brand3],
                    backgroundColor: [brand3],
                }, {
                    label: 'Cohort 2018-2019',
                    data: valuesArray4,
                    borderColor: [brand4],
                    backgroundColor: [brand4],
                }]
            },
            options: {
                indexAxis: "x",
                maintainAspectRatio: false,
                elements: {
                    line: {
                        fill: false,
                    },
                    bar: {
                        borderWidth: 2,
                        borderRadius: 5,
                    }
                },
                interaction: {
                    mode: "nearest",
                },
                events: ['mousemove', 'mouseout', 'click', 'touchstart', 'touchmove'],
                plugins: {
                    legend: {
                        display: true,
                        position: "top",
                        align: "center",
                        labels: {
                            boxWidth: 40,
                            boxHeight: 10,
                            color: canvas.css("color"),
                            padding: 10,
                            textAlign: "left",
                            useBorderRadius: true,
                        },
                    },
                    tooltip: {
                        enabled: true,
                        backgroundColor: tooltipColors.css("background-color"),
                        titleColor: tooltipColors.css("color"),
                        bodyColor: tooltipColors.css("color"),
                        footerColor: tooltipColors.css("color"),
                        padding: 6,
                        caretSize: 5,
                        cornerRadius: 6,
                        displayColors: true,
                        boxPadding: 4,
                        callbacks: {
                            label: function (context) {
                                const value = context.parsed.y;
                                return `$${value.toFixed(2)}`;
                            }
                        }
                    },
                    annotation: {
                        annotations: {
                            povertyLine: {
                                type: 'line',
                                yMin: 2.15,
                                yMax: 2.15,
                                borderColor: 'rgba(235, 87, 87, 0.4)',
                                borderWidth: 2,
                                borderDash: [6, 6],
                                label: {
                                    content: 'Extreme Poverty Line ($2.15)',
                                    enabled: true,
                                    position: 'end',
                                    backgroundColor: 'transparent',
                                    color: '#eb5757',
                                    font: {
                                        weight: 'bold',
                                        size: 12,
                                    },
                                    xAdjust: -10,
                                    yAdjust: -10
                                }
                            }
                        }
                    }
                },
                scales: {
                    x: {
                        grid: {
                            display: true,
                            color: canvas.css("border-color"),
                        }
                    },
                    y: {
                        grid: {
                            display: true,
                            color: canvas.css("border-color"),
                        },
                        beginAtZero: true,
                        max: 6,
                        ticks: {
                            stepSize: 0.5,
                            callback: function (value) {
                                return `$${value.toFixed(2)}`;
                            }
                        }
                    }
                }
            }
        });
    });
    //Charts JS CHART 2
    $(".chart2_wrap").each(function () {
        let canvas = $(this).find("canvas");
        let tooltipColors = $(this).find(".chart_tooltip_colors");
        let items = $(this).find(".chart_item");

        let labelsArray = [];
        let valuesArray = [];
        let valuesArray2 = [];
        let valuesArray3 = [];
        let valuesArray4 = [];
        items.each(function () {
            labelsArray.push($(this).attr("data-label"));
            valuesArray.push($(this).attr("data-value-1"));
            valuesArray2.push($(this).attr("data-value-2"));
            valuesArray3.push($(this).attr("data-value-3"));
            valuesArray4.push($(this).attr("data-value-4"));
        });

        let brand1 = $("html").css("--brand-gold");
        let brand2 = $("html").css("--brand-blue");
        let brand3 = $("html").css("--brand-peach");
        let brand4 = $("html").css("--brand-green");

        let chart = new Chart(canvas[0], {
            type: 'bar', // bar, line, pie
            data: {
                labels: labelsArray,
                datasets: [{
                    label: 'Cohort One',
                    data: valuesArray,
                    borderColor: [brand1],
                    backgroundColor: [brand1],
                }, {
                    label: 'Cohort Two',
                    data: valuesArray2,
                    borderColor: [brand2],
                    backgroundColor: [brand2],
                }, {
                    label: 'Cohort Three',
                    data: valuesArray3,
                    borderColor: [brand3],
                    backgroundColor: [brand3],
                }, {
                    label: 'Cohort Four',
                    data: valuesArray4,
                    borderColor: [brand4],
                    backgroundColor: [brand4],
                },]
            },
            options: {
                indexAxis: "x", // x or y for horizontal
                maintainAspectRatio: false,
                elements: {
                    line: {
                        fill: false,
                    },
                    bar: {
                        borderWidth: 2,
                        borderRadius: 5,
                    }
                },
                interaction: {
                    mode: "nearest", // nearest, index, dataset, x, y
                },
                events: ['mousemove', 'mouseout', 'click', 'touchstart', 'touchmove'],
                plugins: {
                    legend: {
                        display: true,
                        position: "top", // top, left, bottom, right, chatArea
                        align: "center", // start, center, end
                        labels: {
                            boxWidth: 40,
                            boxHeight: 10,
                            color: canvas.css("color"),
                            padding: 10,
                            textAlign: "left", // left, center, right
                            useBorderRadius: true,
                        },
                    },
                    tooltip: {
                        enabled: true,
                        backgroundColor: tooltipColors.css("background-color"),
                        titleColor: tooltipColors.css("color"),
                        bodyColor: tooltipColors.css("color"),
                        footerColor: tooltipColors.css("color"),
                        padding: 6,
                        caretSize: 5,
                        cornerRadius: 6,
                        displayColors: true, // show color boxes in tooltip
                        boxPadding: 4, // space between color box and text
                    }
                },
                scales: {
                    x: {
                        grid: {
                            display: true,
                            color: canvas.css("border-color"),
                        }
                    },
                    y: {
                        grid: {
                            display: true,
                            color: canvas.css("border-color"),
                        },
                        beginAtZero: true,
                        max: 4, // 🔹 Set max Y-axis value (Change to 3.5 if needed)
                        ticks: {
                            stepSize: 0.5, // 🔹 Optional: Controls interval (e.g., 0, 0.5, 1, 1.5, ...)
                        }
                    }
                }
            }
        });
    });

    //Charts JS CHART 3
    $(".chart3_wrap").each(function () {
        let canvas = $(this).find("canvas");
        let tooltipColors = $(this).find(".chart_tooltip_colors");
        let items = $(this).find(".chart_item");

        let labelsArray = [];
        let valuesArray = [];
        let valuesArray2 = [];
        let valuesArray3 = [];
        let valuesArray4 = [];

        items.each(function () {
            labelsArray.push($(this).attr("data-label"));
            valuesArray.push(parseFloat($(this).attr("data-value-1")));
            valuesArray2.push(parseFloat($(this).attr("data-value-2")));
            valuesArray3.push(parseFloat($(this).attr("data-value-3")));
            valuesArray4.push(parseFloat($(this).attr("data-value-4")));
        });

        let brand1 = $("html").css("--brand-gold");
        let brand2 = $("html").css("--brand-blue");
        let brand3 = $("html").css("--brand-peach");
        let brand4 = $("html").css("--brand-green");

        const ctx = canvas[0].getContext("2d");
        const chartHeight = canvas[0].offsetHeight || 400; // Fallback if height isn't set

        function makeGradient(color) {
            const gradient = ctx.createLinearGradient(0, 0, 0, chartHeight);
            gradient.addColorStop(0, hexToRgba(color, 0.5));
            gradient.addColorStop(1, hexToRgba(color, 0));
            return gradient;
        }

        let chart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: labelsArray,
                datasets: [{
                    label: 'Baseline 2017',
                    data: valuesArray,
                    borderColor: brand1,
                    backgroundColor: makeGradient(brand1),
                    fill: true
                }, {
                    label: 'Endline 2019',
                    data: valuesArray2,
                    borderColor: brand2,
                    backgroundColor: makeGradient(brand2),
                    fill: true
                }, {
                    label: 'Current 2024',
                    data: valuesArray3,
                    borderColor: brand3,
                    backgroundColor: makeGradient(brand3),
                    fill: true
                }]
            },
            options: {
                indexAxis: "x",
                maintainAspectRatio: false,
                elements: {
                    line: {
                        fill: true,
                    }
                },
                plugins: {
                    legend: {
                        display: true,
                        labels: {
                            color: canvas.css("color")
                        }
                    },
                    tooltip: {
                        backgroundColor: tooltipColors.css("background-color"),
                        titleColor: tooltipColors.css("color"),
                        bodyColor: tooltipColors.css("color"),
                        callbacks: {
                            label: function (context) {
                                return `${context.parsed.y.toFixed(2)}%`;
                            }
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        max: 100,
                        ticks: {
                            callback: value => `${value.toFixed(2)}%`
                        },
                        grid: {
                            color: canvas.css("border-color")
                        }
                    },
                    x: {
                        grid: {
                            color: canvas.css("border-color")
                        }
                    }
                }
            }
        });

        function hexToRgba(hex, alpha) {
            let c = hex.replace("#", "");
            if (c.length === 3) {
                c = c.split("").map(s => s + s).join("");
            }
            const bigint = parseInt(c, 16);
            const r = (bigint >> 16) & 255;
            const g = (bigint >> 8) & 255;
            const b = bigint & 255;
            return `rgba(${r},${g},${b},${alpha})`;
        }
    });
    //Tim's secret
    // window.addEventListener("DOMContentLoaded", (event) => {
    //   $("[data-gsap-hide]").css("visibility", "visible");
    // });


  


}

function InvestmentInit() {

    //Map Location Modal
    // $(".map-location").on("mouseenter", function (e) {
    //   let linkName = $(this).attr("location-name");
    //   $("div.location").text(linkName);
    // });

    // $('.map-location').on("mouseleave", function (e) {
    //   $("div.location").text('Hover a Location');
    // });

    //Charts JS
    $(".chart_wrap").each(function () {
        let canvas = $(this).find("canvas");
        let tooltipColors = $(this).find(".chart_tooltip_colors");
        let items = $(this).find(".chart_item");

        let labelsArray = [];
        let valuesArray = [];
        let valuesArray2 = [];
        let valuesArray3 = [];
        let valuesArray4 = [];
        items.each(function () {
            labelsArray.push($(this).attr("data-label"));
            valuesArray.push($(this).attr("data-value-1"));
            valuesArray2.push($(this).attr("data-value-2"));
            valuesArray3.push($(this).attr("data-value-3"));
            valuesArray4.push($(this).attr("data-value-4"));
        });

        let brand1 = $("html").css("--brand-gold");
        let brand2 = $("html").css("--brand-blue");
        let brand3 = $("html").css("--brand-peach");
        let brand4 = $("html").css("--brand-green");

        let chart = new Chart(canvas[0], {
            type: 'line', // bar, line, pie
            data: {
                labels: labelsArray,
                datasets: [{
                    label: 'Cohort One',
                    data: valuesArray,
                    borderColor: [brand1],
                    backgroundColor: [brand1],
                }, {
                    label: 'Cohort Two',
                    data: valuesArray2,
                    borderColor: [brand2],
                    backgroundColor: [brand2],
                }, {
                    label: 'Cohort Three',
                    data: valuesArray3,
                    borderColor: [brand3],
                    backgroundColor: [brand3],
                }, {
                    label: 'Cohort Four',
                    data: valuesArray4,
                    borderColor: [brand4],
                    backgroundColor: [brand4],
                },]
            },
            options: {
                indexAxis: "x", // x or y for horizontal
                maintainAspectRatio: false,
                elements: {
                    line: {
                        fill: false,
                    },
                    bar: {
                        borderWidth: 2,
                        borderRadius: 5,
                    }
                },
                interaction: {
                    mode: "nearest", // nearest, index, dataset, x, y
                },
                events: ['mousemove', 'mouseout', 'click', 'touchstart', 'touchmove'],
                plugins: {
                    legend: {
                        display: true,
                        position: "top", // top, left, bottom, right, chatArea
                        align: "center", // start, center, end
                        labels: {
                            boxWidth: 40,
                            boxHeight: 10,
                            color: canvas.css("color"),
                            padding: 10,
                            textAlign: "left", // left, center, right
                            useBorderRadius: true,
                        },
                    },
                    tooltip: {
                        enabled: true,
                        backgroundColor: tooltipColors.css("background-color"),
                        titleColor: tooltipColors.css("color"),
                        bodyColor: tooltipColors.css("color"),
                        footerColor: tooltipColors.css("color"),
                        padding: 6,
                        caretSize: 5,
                        cornerRadius: 6,
                        displayColors: true, // show color boxes in tooltip
                        boxPadding: 4, // space between color box and text
                    }
                },
                scales: {
                    x: {
                        grid: {
                            display: true,
                            color: canvas.css("border-color"),
                        }
                    },
                    y: {
                        grid: {
                            display: true,
                            color: canvas.css("border-color"),
                        },
                        beginAtZero: true,
                        max: 4, // 🔹 Set max Y-axis value (Change to 3.5 if needed)
                        ticks: {
                            stepSize: 0.5, // 🔹 Optional: Controls interval (e.g., 0, 0.5, 1, 1.5, ...)
                        }
                    }
                }
            }
        });
    });

    //Charts JS
    $(".chart2_wrap").each(function () {
        let canvas = $(this).find("canvas");
        let tooltipColors = $(this).find(".chart_tooltip_colors");
        let items = $(this).find(".chart_item");

        let labelsArray = [];
        let valuesArray = [];
        let valuesArray2 = [];
        let valuesArray3 = [];
        let valuesArray4 = [];
        items.each(function () {
            labelsArray.push($(this).attr("data-label"));
            valuesArray.push($(this).attr("data-value-1"));
            valuesArray2.push($(this).attr("data-value-2"));
            valuesArray3.push($(this).attr("data-value-3"));
            valuesArray4.push($(this).attr("data-value-4"));
        });

        let brand1 = $("html").css("--brand-gold");
        let brand2 = $("html").css("--brand-blue");
        let brand3 = $("html").css("--brand-peach");
        let brand4 = $("html").css("--brand-green");

        let chart = new Chart(canvas[0], {
            type: 'bar', // bar, line, pie
            data: {
                labels: labelsArray,
                datasets: [{
                    label: 'Cohort One',
                    data: valuesArray,
                    borderColor: [brand1],
                    backgroundColor: [brand1],
                }, {
                    label: 'Cohort Two',
                    data: valuesArray2,
                    borderColor: [brand2],
                    backgroundColor: [brand2],
                }, {
                    label: 'Cohort Three',
                    data: valuesArray3,
                    borderColor: [brand3],
                    backgroundColor: [brand3],
                }, {
                    label: 'Cohort Four',
                    data: valuesArray4,
                    borderColor: [brand4],
                    backgroundColor: [brand4],
                },]
            },
            options: {
                indexAxis: "x", // x or y for horizontal
                maintainAspectRatio: false,
                elements: {
                    line: {
                        fill: false,
                    },
                    bar: {
                        borderWidth: 2,
                        borderRadius: 5,
                    }
                },
                interaction: {
                    mode: "nearest", // nearest, index, dataset, x, y
                },
                events: ['mousemove', 'mouseout', 'click', 'touchstart', 'touchmove'],
                plugins: {
                    legend: {
                        display: true,
                        position: "top", // top, left, bottom, right, chatArea
                        align: "center", // start, center, end
                        labels: {
                            boxWidth: 40,
                            boxHeight: 10,
                            color: canvas.css("color"),
                            padding: 10,
                            textAlign: "left", // left, center, right
                            useBorderRadius: true,
                        },
                    },
                    tooltip: {
                        enabled: true,
                        backgroundColor: tooltipColors.css("background-color"),
                        titleColor: tooltipColors.css("color"),
                        bodyColor: tooltipColors.css("color"),
                        footerColor: tooltipColors.css("color"),
                        padding: 6,
                        caretSize: 5,
                        cornerRadius: 6,
                        displayColors: true, // show color boxes in tooltip
                        boxPadding: 4, // space between color box and text
                    }
                },
                scales: {
                    x: {
                        grid: {
                            display: true,
                            color: canvas.css("border-color"),
                        }
                    },
                    y: {
                        grid: {
                            display: true,
                            color: canvas.css("border-color"),
                        },
                        beginAtZero: true,
                        max: 4, // 🔹 Set max Y-axis value (Change to 3.5 if needed)
                        ticks: {
                            stepSize: 0.5, // 🔹 Optional: Controls interval (e.g., 0, 0.5, 1, 1.5, ...)
                        }
                    }
                }
            }
        });
    });

    //Tim's secret
    // window.addEventListener("DOMContentLoaded", (event) => {
    //   $("[data-gsap-hide]").css("visibility", "visible");
    // });

    // RunCountup();
}

function PeopletInit() {


    

    // window.addEventListener("DOMContentLoaded", function () {
    //   let  f2856 = new Funraise({
    //         id: "b03deba9-831a-46de-9fdc-04a4311e9b56:2856",
    //         isPopup: true
    //     });
    //     f2856.init();

    //     document.querySelector(".btn-animate-chars").addEventListener("click", function (e) {
    //         e.preventDefault(); // prevents link default behavior
    //         f2856.open();
    //     });
    // });



    //Tim's secret
    // window.addEventListener("DOMContentLoaded", (event) => {
    //   $("[data-gsap-hide]").css("visibility", "visible");
    // });
    // //Map Location Modal
    // $(".map-location").on("mouseenter", function (e) {
    //   let linkName = $(this).attr("location-name");
    //   $("div.location").text(linkName);
    // });

    // $('.map-location').on("mouseleave", function (e) {
    //   $("div.location").text('Hover a Location');
    // });


    setupFunraise();
}



function RunFirst() {
    //Tim's secret

    $("[data-gsap-hide]").css("visibility", "visible");


    // setTimeout(() => {
    //     ScrollTrigger.refresh();
    // }, 1000);
    ScrollTrigger.refresh();

    //Global Font VW  
    function setFullWidthFontSize() {
        $(".text-wrapper").each(function () {
            let parentWidth = $(this).width();
            let child = $(this).children();

            let fontSize = 0.5;
            child.css("font-size", fontSize + "cqw");
            while (child.width() < parentWidth) {
                fontSize += 0.1;
                child.css("font-size", fontSize + "cqw");
            }
            fontSize -= 0.1;
            child.css("font-size", fontSize + "cqw");
        });
    }

    function isDesktop() {
        return window.matchMedia("(min-width: 992px)").matches; // Adjust if needed
    }

    if (isDesktop()) {
        setFullWidthFontSize();
        document.fonts.ready.then(setFullWidthFontSize);
    }

    //Scrub Text

    document.querySelectorAll(".text_1_wrap").forEach(function (element) {
        if (element.dataset.scriptInitialized) return;
        element.dataset.scriptInitialized = "true";

        const typeSplit = new SplitType(element, {
            types: "words",
        });

        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: element,
                start: "top center",
                end: "bottom center",
                scrub: true,
            },
        });
        tl.from(typeSplit.words, { "--text_1_line-width": "0%", stagger: 0.5, ease: "none" });
    });

    //OG Footer Code
    $(".home-scroll_section").each(function (index) {
        let childTriggers = $(this).find(".home-scroll_text-item");
        let childTargets = $(this).find(".home-scroll_img-item");
        // switch active class
        function makeItemActive(index) {
            childTriggers.removeClass("is-active");
            childTargets.removeClass("is-active");
            childTriggers.eq(index).addClass("is-active");
            childTargets.eq(index).addClass("is-active");
        }
        makeItemActive(0);
        // create triggers
        childTriggers.each(function (index) {
            ScrollTrigger.create({
                trigger: $(this),
                start: "top center",
                end: "bottom center",
                onToggle: (isActive) => {
                    if (isActive) {
                        makeItemActive(index);
                    }
                }
            });
        });
    });

    //2023 Hero images
    if (window.location.href.includes("2023")) {
        // 2023 Report Hero images
        gsap.from("[hero-img-1]", {
            yPercent: 120, duration: 1, ease: "expo.out", delay: 0.2
        });
        gsap.to("[hero-img-1]", {
            yPercent: -120, duration: 0.5, ease: "expo.out", delay: 3.2
        });
        gsap.from("[hero-img-2]", {
            yPercent: 120, duration: 1, ease: "expo.out", delay: 0.4
        });
        gsap.to("[hero-img-2]", {
            yPercent: -120, duration: 0.5, ease: "expo.out", delay: 3.4
        });
        gsap.from("[hero-img-3]", {
            yPercent: 120, duration: 1, ease: "expo.out", delay: 0.6
        });
        gsap.to("[hero-img-3]", {
            yPercent: -120, duration: 0.5, ease: "expo.out", delay: 3.6
        });
        gsap.from("[hero-img-4]", {
            yPercent: 120, duration: 1, ease: "expo.out", delay: 3.6, stagger: 0.1
        });
        gsap.to("[hero-img-4]", {
            yPercent: -120, duration: 0.5, ease: "expo.out", delay: 6.6, stagger: 0.1
        });
        gsap.from("[hero-img-5]", {
            yPercent: 120, duration: 1, ease: "expo.out", delay: 7, stagger: 0.1
        });
        gsap.from("[hero-img-6]", {
            yPercent: 120, duration: 1, ease: "expo.out", delay: 6.2, stagger: 0.1
        });
        gsap.from("[hero-img-7]", {
            yPercent: 120, duration: 1, ease: "expo.out", delay: 8, stagger: 0.1
        });

    }
    //Accordion JS
    if ($('.accordion_1_cms_wrap').length) {
        document.querySelectorAll(".accordion_1_cms_wrap").forEach((cmsWrap, listIndex) => {
            if (cmsWrap.dataset.scriptInitialized) return;
            cmsWrap.dataset.scriptInitialized = "true";

            const closePrevious = cmsWrap.getAttribute("data-close-previous") !== "false";
            const closeOnSecondClick = cmsWrap.getAttribute("data-close-on-second-click") !== "false";
            const openOnHover = cmsWrap.getAttribute("data-open-on-hover") === "true";
            const openByDefault = cmsWrap.getAttribute("data-open-by-default") !== null && !isNaN(+cmsWrap.getAttribute("data-open-by-default")) ? +cmsWrap.getAttribute("data-open-by-default") : false;

            let previousIndex = null, closeFunctions = [];

            cmsWrap.querySelectorAll(".accordion_1_component").forEach((thisCard, cardIndex) => {
                const button = thisCard.querySelector(".accordion_1_toggle_button");
                const content = thisCard.querySelector(".accordion_1_content_wrap");
                const icon = thisCard.querySelector(".accordion_1_toggle_icon");

                if (!button || !content || !icon) return console.warn("Missing elements:", thisCard);

                button.setAttribute("aria-expanded", "false");
                button.setAttribute("id", "accordion_1_button_" + listIndex + "_" + cardIndex);
                content.setAttribute("id", "accordion_1_content_" + listIndex + "_" + cardIndex);
                button.setAttribute("aria-controls", content.id);
                content.setAttribute("aria-labelledby", button.id);
                content.style.display = "none";

                const refresh = () => { tl.invalidate(); if (typeof ScrollTrigger !== "undefined") ScrollTrigger.refresh(); };
                const tl = gsap.timeline({ paused: true, defaults: { duration: 0.3, ease: "power1.inOut" }, onComplete: refresh, onReverseComplete: refresh });
                tl.set(content, { display: "block" });
                tl.fromTo(content, { height: 0 }, { height: "auto" });
                tl.fromTo(icon, { rotate: 0 }, { rotate: 45 }, "<");

                const closeAccordion = () => thisCard.classList.contains("is-opened") && (thisCard.classList.remove("is-opened"), tl.reverse(), button.setAttribute("aria-expanded", "false"));
                closeFunctions[cardIndex] = closeAccordion;

                const openAccordion = (instant = false) => {
                    if (closePrevious && previousIndex !== null && previousIndex !== cardIndex) closeFunctions[previousIndex]?.();
                    previousIndex = cardIndex;
                    button.setAttribute("aria-expanded", "true")
                    thisCard.classList.add("is-opened");
                    instant ? tl.progress(1) : tl.play();
                };
                if (openByDefault === cardIndex) openAccordion(true);

                button.addEventListener("click", () => thisCard.classList.contains("is-opened") && closeOnSecondClick ? (closeAccordion(), previousIndex = null) : openAccordion());
                if (openOnHover) button.addEventListener("mouseenter", () => openAccordion());
            });
        });
    }


}

function initLoaderThreeSteps(heroTl) {
    var tl = gsap.timeline({
        onComplete: () => heroTl.play(), // Play hero animation after loader completes
    });

    gsap.defaults({
        ease: "Expo.easeInOut",
        duration: 1.2,
    });

    /* Loading numbers */
    var randomNumbers1 = gsap.utils.random([2, 3, 4]);
    var randomNumbers2 = gsap.utils.random([5, 6]);
    var randomNumbers3 = gsap.utils.random([1, 5]);
    var randomNumbers4 = gsap.utils.random([7, 8, 9]);

    /* Loading Timeline */
    tl.set(".loading-container", { display: "block" });
    tl.set(".loading-screen", { display: "block" });
    tl.set(".loading__progress-inner", { scaleY: 0 });
    tl.set(".loading__number-group.is--first .loading__number-wrap, .loading__percentage", { yPercent: 100 });
    tl.set(".loading__number-group.is--second .loading__number-wrap, .loading__number-group.is--third .loading__number-wrap", { yPercent: 10 });

    tl.to(".loading__progress-inner", { scaleY: (randomNumbers1 + "" + randomNumbers3) / 100 });
    tl.to(".loading__percentage", { yPercent: 0 }, "<");
    tl.to(".loading__number-group.is--second .loading__number-wrap", { yPercent: (randomNumbers1 - 1) * -10 }, "<");
    tl.to(".loading__number-group.is--third .loading__number-wrap", { yPercent: (randomNumbers3 - 1) * -10 }, "<");

    tl.to(".loading__progress-inner", { scaleY: (randomNumbers2 + "" + randomNumbers4) / 100 });
    tl.to(".loading__number-group.is--second .loading__number-wrap", { yPercent: (randomNumbers2 - 1) * -10 }, "<");
    tl.to(".loading__number-group.is--third .loading__number-wrap", { yPercent: (randomNumbers4 - 1) * -10 }, "<");

    tl.to(".loading__progress-inner", { scaleY: 1 });
    tl.to(".loading__number-group.is--second .loading__number-wrap", { yPercent: -90 }, "<");
    tl.to(".loading__number-group.is--third .loading__number-wrap", { yPercent: -90 }, "<");
    tl.to(".loading__number-group.is--first .loading__number-wrap", { yPercent: 0 }, "<");

    /* --- Numbers Slide Up to Hidden State Before Loader Moves --- */
    tl.to(".loading__number-wrap, .loading__percentage", {
        yPercent: -200, // Moves numbers further up out of view
        opacity: 0,
        duration: 0.6,
        ease: "power2.inOut",
    });

    /* --- Hide Loading Screen by Sliding Up (Faster: 0.8s) --- */
    tl.to(".loading-container", {
        yPercent: -100, // Move it up out of view
        duration: 0.5, // Faster transition
        ease: "power2.inOut",
    });

    /* Ensure it is removed from the flow */
    tl.to(".loading-container", {
        autoAlpha: 0,
        duration: 0.3,
        ease: "power2.inOut",
    });
}

/* --- Create Hero Animation but Keep it Paused --- */
function createHeroAnimation() {
    var heroTl = gsap.timeline({ paused: true });

    // Hero Image Scale
    $("[data-scale-bg]").each(function () {
        heroTl.fromTo(
            this,
            { scale: 1.7 }, // Start at 1.7x size
            { scale: 1, duration: 2, ease: "power2.out" }, // Animate to 1x over 2 seconds
            "<"
        );
    });

    // Title Animation (split + animate on desktop, revert on mobile)
    $("[data-split]").each(function () {
        // Revert any previous split on this element
        if (this._splitInstance) this._splitInstance.revert();

        if (window.matchMedia("(min-width: 768px)").matches) {
            // Desktop: split by chars and animate
            const split = new SplitType(this, { types: "chars" });
            this._splitInstance = split;

            heroTl.from(
                split.chars,
                {
                    yPercent: 100,
                    stagger: 0.04,
                    duration: 0.6,
                    ease: "power2.out",
                },
                "-=1.5"
            );
        } else {
            // Mobile: reset text wrapping
            const split = new SplitType(this, { types: "words" });
            split.revert();
            this._splitInstance = null;
        }
    });

    // Paragraph Animation
    $("[data-split-lines]").each(function () {
        let text = new SplitType(this, { types: "lines" });

        // Wrap each line in a div to clip it properly
        $(text.lines).wrap("<div class='line-wrapper'></div>");

        heroTl.from(
            text.lines,
            {
                yPercent: 100, // Start below
                stagger: 0.1, // Delay between each line
                duration: 0.8,
                ease: "power2.out",
            },
            "-=1"
        ); // Slightly overlaps for a smooth effect
    });

    // Nav Reveal Animation (Now Starts Sooner)
    heroTl.from(
        ".nav_component",
        {
            yPercent: -100, // Start above viewport
            opacity: 0, // Make it invisible initially
            duration: 0.6, // Speed up reveal
            ease: "expo.out",
        },
        "-=3.0"
    ); // Nav appears sooner than before

    // ✅ Fade In .vprops-wrap AFTER Text Animations
    heroTl.from(
        ".vprops-wrap",
        {
            opacity: 0,
            y: 20, // Slight upward movement for a softer effect
            duration: 0.8,
            ease: "power2.out",
        },
        "-=0.5" // Slight overlap to keep flow smooth
    );

    return heroTl;
}



// Split words into individual letters using SplitType
// let text = new SplitType('[data-split]', { types: 'chars' });

//Button Animation 
function initButtonCharacterStagger() {
    const offsetIncrement = 0.01; // Transition offset increment in seconds
    const buttons = document.querySelectorAll('[data-button-animate-chars]');

    buttons.forEach(button => {
        const text = button.textContent; // Get the button's text content
        button.innerHTML = ''; // Clear the original content

        [...text].forEach((char, index) => {
            const span = document.createElement('span');
            span.textContent = char;
            span.style.transitionDelay = `${index * offsetIncrement}s`;

            // Handle spaces explicitly
            if (char === ' ') {
                span.style.whiteSpace = 'pre'; // Preserve space width
            }

            button.appendChild(span);
        });
    });
}



function initModalBasic() {

    const modalGroup = document.querySelector('[data-modal-group-status]');
    const modals = document.querySelectorAll('[data-modal-name]');
    const modalTargets = document.querySelectorAll('[data-modal-target]');

    // Open modal
    modalTargets.forEach((modalTarget) => {
        modalTarget.addEventListener('click', function () {
            const modalTargetName = this.getAttribute('data-modal-target');

            // Close all modals
            modalTargets.forEach((target) => target.setAttribute('data-modal-status', 'not-active'));
            modals.forEach((modal) => modal.setAttribute('data-modal-status', 'not-active'));

            // Activate clicked modal
            document.querySelector(`[data-modal-target="${modalTargetName}"]`).setAttribute('data-modal-status', 'active');
            document.querySelector(`[data-modal-name="${modalTargetName}"]`).setAttribute('data-modal-status', 'active');

            // Set group to active
            if (modalGroup) {
                modalGroup.setAttribute('data-modal-group-status', 'active');
            }
        });
    });

    // Close modal
    document.querySelectorAll('[data-modal-close]').forEach((closeBtn) => {
        closeBtn.addEventListener('click', closeAllModals);
    });

    // Close modal on `Escape` key
    document.addEventListener('keydown', function (event) {
        if (event.key === 'Escape') {
            closeAllModals();
        }
    });

    // Function to close all modals
    function closeAllModals() {
        modalTargets.forEach((target) => target.setAttribute('data-modal-status', 'not-active'));

        if (modalGroup) {
            modalGroup.setAttribute('data-modal-group-status', 'not-active');
        }
    }
}

// // Initialize Basic Modal
// document.addEventListener('DOMContentLoaded', () => {
//   initModalBasic();
// });

// if ($(".map-location").length) {
// $(".map-location").on("mouseenter", function (e) {
//   let linkName = $(this).attr("location-name");
//   $("div.location").text(linkName);
// });

// $('.map-location').on("mouseleave", function (e) {
//   $("div.location").text('Hover a Location');
// });
// }



//Tim's secret  
/* --- Hero Animation Function --- */
function animateStandardHero() {
    var heroTl = gsap.timeline();
    console.log('ANIMATE HERO IS OCCURING')
    // Hero Image Scale
    $("[data-scale-bg]").each(function () {
        heroTl.fromTo(this,
            { scale: 1.7 },  // Start at 1.7x size
            { scale: 1, duration: 2, ease: "power2.out" },  // Animate to 1x over 2 seconds
            "<"
        );
    });

    let split; // Declare outside to manage and revert across viewports

    function animateTitleText() {
        // Revert any previous SplitType instance
        if (split) split.revert();

        $("[data-split]").each(function () {
            // Desktop: animate characters
            if (window.matchMedia("(min-width: 768px)").matches) {
                split = new SplitType(this, { types: "chars" });
                gsap.set(split.chars, { opacity: 1 });

                heroTl.from(
                    split.chars,
                    {
                        yPercent: 100,
                        stagger: 0.05,
                        duration: 0.6,
                        ease: "power2.out",
                    },
                    "-=1.5"
                );
            } else {
                // Mobile: just reset to normal words (no animation needed)
                split = new SplitType(this, { types: "words" });
                split.revert(); // Removes all spans, restoring natural wrapping
            }
        });
    }

    // Run once on page load
    animateTitleText();

    // Optional: run on resize (debounced)
    window.addEventListener("resize", debounce(animateTitleText, 250));

    // Debounce utility to avoid excessive calls
    function debounce(func, delay) {
        let timer;
        return function () {
            clearTimeout(timer);
            timer = setTimeout(func, delay);
        };
    }

    // Paragraph Animation
    $("[data-split-lines]").each(function () {
        let text = new SplitType(this, { types: "lines" });

        // Wrap each line in a div to clip it properly
        $(text.lines).wrap("<div class='line-wrapper'></div>");

        heroTl.from(text.lines, {
            yPercent: 100,  // Start below
            stagger: 0.1,   // Delay between each line
            duration: 0.8,
            ease: "power2.out"
        }, "-=1"); // Slightly overlaps for a smooth effect
    });

    // Nav Reveal Animation (Now Starts Sooner)
    heroTl.from(".nav_component", {
        yPercent: -100,  // Start above viewport
        opacity: 0,      // Make it invisible initially
        duration: 0.6,   // Speed up reveal
        ease: "expo.out"
    }, "-=3.0"); // Nav appears sooner than before
}



function FooterCode() {
    const currentYear = new Date().getFullYear();
    const currentYearElements = document.querySelectorAll('[data-current-year]');
    currentYearElements.forEach(currentYearElement => {
        currentYearElement.textContent = currentYear;
    });
}

function RebootWebflowFunctions() {
    window.Webflow.destroy();
    window.Webflow.ready();
    window.Webflow.require("ix2").init();
}



let f2856;

// Function to initialize Funraise and set up event listeners
function setupFunraise() {
  if (typeof Funraise === "undefined") {
    console.warn("Funraise not loaded yet");
    return;
  }

  f2856 = new Funraise({
    id: "b03deba9-831a-46de-9fdc-04a4311e9b56:2856",
    isPopup: true
  });

  f2856.init();

  // Make sure the button exists in the current DOM
  const btn = document.querySelector(".btn-animate-chars");
  if (btn) {
    btn.addEventListener("click", function (e) {
      e.preventDefault();
      f2856.open();
    });
  } else {
    console.warn("Button .btn-animate-chars not found");
  }
}


function RunCohorttablesCode()
{

  //*********************/
    //cohort tables code
    //*********************/
   
// document.addEventListener("DOMContentLoaded", function () {
	document.querySelectorAll(".tab_1_wrap").forEach((tabWrap, componentIndex) => {
		if (tabWrap.dataset.scriptInitialized) return;
		tabWrap.dataset.scriptInitialized = "true";

		const allowLoop = tabWrap.getAttribute("data-allow-loop") === "true",
			defaultTab = +tabWrap.getAttribute("data-default-tab") || 0,
			buttonList = tabWrap.querySelector(".tab_1_button_list"),
			buttonItems = tabWrap.querySelectorAll(".tab_1_button_item"),
			panelList = tabWrap.querySelector(".tab_1_content_list"),
			panelItems = tabWrap.querySelectorAll(".tab_1_content_item"),
			previousButton = tabWrap.querySelector(".tab_1_control_button.is-previous"),
			nextButton = tabWrap.querySelector(".tab_1_control_button.is-next");

		if (!buttonList || !panelList || !buttonItems.length || !panelItems.length) {
			console.warn("Missing elements in:", tabWrap);
			return;
		}

		panelList.removeAttribute("role");
		buttonList.setAttribute("role", "tablist");
		buttonItems.forEach((btn) => btn.setAttribute("role", "tab"));
		panelItems.forEach((panel) => panel.setAttribute("role", "tabpanel"));

		let activeIndex = defaultTab;
		const makeActive = (index, focus = true) => {
			activeIndex = index;
			buttonItems.forEach((btn, i) => {
				btn.classList.toggle("is-active", i === index);
				btn.setAttribute("aria-selected", i === index ? "true" : "false");
				btn.setAttribute("tabindex", i === index ? "0" : "-1");
			});
			panelItems.forEach((panel, i) => panel.classList.toggle("is-active", i === index));
			if (typeof ScrollTrigger !== "undefined") ScrollTrigger.refresh();
			if (nextButton) nextButton.disabled = index === buttonItems.length - 1 && !allowLoop;
			if (previousButton) previousButton.disabled = index === 0 && !allowLoop;
			if (focus) buttonItems[index].focus();
		};

		makeActive(defaultTab, false);

		const updateIndex = (delta) => makeActive((activeIndex + delta + buttonItems.length) % buttonItems.length);
		nextButton?.addEventListener("click", () => updateIndex(1));
		previousButton?.addEventListener("click", () => updateIndex(-1));

		buttonItems.forEach((btn, index) => {
			btn.setAttribute("id", "tab_1_button_" + componentIndex + "_" + index);
			btn.setAttribute("aria-controls", "tab_1_panel_" + componentIndex + "_" + index);
			panelItems[index].setAttribute("id", "tab_1_panel_" + componentIndex + "_" + index);
			panelItems[index].setAttribute("aria-labelledby", btn.id);
			btn.addEventListener("click", () => makeActive(index));
			btn.addEventListener("keydown", (e) => {
				if (["ArrowRight", "ArrowDown"].includes(e.key)) updateIndex(1);
				else if (["ArrowLeft", "ArrowUp"].includes(e.key)) updateIndex(-1);
			});
		});
	});
// });
}


function RunCountup()
{
    const existingScript = document.querySelector('script[src*="https://cdn.jsdelivr.net/npm/@flowbase-co/boosters-countup@1.0.0/dist/countup.min.js"]');
    if (existingScript) {
      const newScript = document.createElement('script');
      newScript.src = existingScript.src;
      newScript.async = true;
      document.body.appendChild(newScript);
    }    
}