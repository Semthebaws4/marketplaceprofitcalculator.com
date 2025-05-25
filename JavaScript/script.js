// Calculator berekeningen
document.addEventListener("DOMContentLoaded", function () {
  const verkoopprijsInput = document.getElementById("verkoopprijs");
  const inkoopprijsInput = document.getElementById("inkoopprijs");
  const platformSelect = document.getElementById("platform");
  const lvbTariefSelect = document.getElementById("lvb-tarief");
  const shopifyPaymentSelect = document.getElementById("shopify-payment");
  const shippingMethodSelect = document.getElementById("shipping-method");
  const bolShippingSection = document.getElementById("bol-shipping-section");
  const shopifyPaymentSection = document.getElementById("shopify-payment-section");
  const shippingMethodSection = document.getElementById("shipping-method-section");
  const amazonFeesSection = document.getElementById("amazon-fees-section");
  const amazonFeesInput = document.getElementById("amazon-fees");
  const btwOutput = document.getElementById("btw-output");
  const commissieOutput = document.getElementById("commissie-output");
  const overigeKostenInput = document.getElementById("OverigeKosten");
  const aantalStuksInput = document.getElementById("aantalStuks");
  const adKostenPerSaleInput = document.getElementById("adKostenPerSale");
  const winstOutput = document.getElementById("winst-output");
  const geprognostiseerdeWinstOutput = document.getElementById("geprognostiseerde-winst-output");
  const winstmargeOutput = document.getElementById("winstmarge-output");
  const roiOutput = document.getElementById("roi-output");
  const totaleInvesteringOutput = document.getElementById("totale-investering-output");
  const breakEvenPrijsOutput = document.getElementById("break-even-prijs-output");
  const shippingCostsOutput = document.getElementById("shipping-costs-output");

  // Margin indicators
  const marginIndicatorNegative = document.getElementById("margin-indicator-negative");
  const marginIndicatorPoor = document.getElementById("margin-indicator-poor");
  const marginIndicatorModerate = document.getElementById("margin-indicator-moderate");
  const marginIndicatorGood = document.getElementById("margin-indicator-good");
  const marginIndicatorExcellent = document.getElementById("margin-indicator-excellent");

  // ROI indicators
  const roiIndicatorPoor = document.getElementById("roi-indicator-poor");
  const roiIndicatorModerate = document.getElementById("roi-indicator-moderate");
  const roiIndicatorDecent = document.getElementById("roi-indicator-decent");
  const roiIndicatorGood = document.getElementById("roi-indicator-good");
  const roiIndicatorExcellent = document.getElementById("roi-indicator-excellent");

  // Platform configurations
  const platformConfigs = {
    bol: {
      name: "bol.com",
      commission: (price) => {
        if (price <= 10) return price * 0.124 + 0.2;
        if (price <= 20) return price * 0.124 + 0.4;
        return price * 0.124 + 0.85;
      },
      shipping: (price, format) => {
        const tarieven = {
          "3XS": price < 16 ? 2.44 : 2.64,
          XXS: price < 16 ? 3.17 : 3.37,
          XS: price < 16 ? 4.12 : 4.87,
          S: price < 16 ? 5.05 : 5.8,
          M: price < 16 ? 5.22 : 5.97,
          L: price < 16 ? 6.41 : 7.06,
          VvbBrievenbuspakket: price < 16 ? 4.35 : 4.35,
          VvbPakketNl: price < 16 ? 5.88 : 5.88,
          VvbPakketBe: price < 16 ? 5.70 : 5.70,
        };
        return tarieven[format] || 0;
      }
    },
    shopify: {
      name: "Shopify",
      commission: (price, paymentMethod) => {
        switch (paymentMethod) {
          case 'bancontact':
            return 0.39;
          case 'ideal':
            return 0.29;
          case 'creditcard':
            return price * 0.019 + 0.25;
          case 'paypal':
            return price * 0.0436;
          default:
            return 0;
        }
      },
      shipping: (price, method) => {
        const tarieven = {
          'pakket-nl': 5.10,
          'pakket-be': 5.70
        };
        return tarieven[method] || 0;
      }
    },
    maxeda: {
      name: "Maxeda",
      commission: (price) => price * 0.135, // 13.5% commission
      shipping: (price, method) => {
        const tarieven = {
          'pakket-nl': 5.10,
          'pakket-be': 5.70
        };
        return tarieven[method] || 0;
      }
    }
  };

  function parseInputValue(inputValue) {
    if (!inputValue || inputValue.trim() === '') {
      return 0;
    }
    const cleanValue = inputValue.replace(",", ".");
    const parsed = parseFloat(cleanValue);
    return isNaN(parsed) ? 0 : parsed;
  }

  function berekenBTWBedrag(verkoopprijs) {
    return (verkoopprijs / 121) * 21;
  }

  function berekenCommissie(verkoopprijs) {
    const platform = platformSelect.value;
    if (platform === 'bol') {
      return platformConfigs[platform].commission(verkoopprijs);
    } else if (platform === 'shopify') {
      return platformConfigs[platform].commission(verkoopprijs, shopifyPaymentSelect.value);
    } else if (platform === 'maxeda') {
      return platformConfigs[platform].commission(verkoopprijs);
    } else if (platform === 'amazon') {
      return parseInputValue(amazonFeesInput.value);
    }
    return 0;
  }

  function berekenVerzendkosten(verkoopprijs) {
    const platform = platformSelect.value;
    if (platform === 'bol') {
      return platformConfigs[platform].shipping(verkoopprijs, lvbTariefSelect.value);
    } else if (platform === 'shopify' || platform === 'maxeda') {
      return platformConfigs[platform].shipping(verkoopprijs, shippingMethodSelect.value);
    }
    return 0;
  }

  function berekenBreakEvenPrijs(inkoopprijs, overigeKosten, adKostenPerSale) {
    let breakEvenPrijs = inkoopprijs * 2;
    let previousBreakEvenPrijs;
    
    do {
      previousBreakEvenPrijs = breakEvenPrijs;
      
      const btwBedrag = berekenBTWBedrag(breakEvenPrijs);
      const commissie = berekenCommissie(breakEvenPrijs);
      const verzendkosten = berekenVerzendkosten(breakEvenPrijs);
      
      const totaleKosten = btwBedrag + commissie + verzendkosten + inkoopprijs + overigeKosten + adKostenPerSale;
      
      if (totaleKosten > breakEvenPrijs) {
        breakEvenPrijs = totaleKosten;
      } else {
        breakEvenPrijs = totaleKosten;
      }
      
    } while (Math.abs(breakEvenPrijs - previousBreakEvenPrijs) > 0.01);
    
    return breakEvenPrijs;
  }

  function updateMarginIndicators(winstmarge) {
    // Reset all classes and indicators
    winstmargeOutput.classList.remove('margin-negative', 'margin-poor', 'margin-moderate', 'margin-good', 'margin-excellent');
    marginIndicatorNegative.classList.remove('show');
    marginIndicatorPoor.classList.remove('show');
    marginIndicatorModerate.classList.remove('show');
    marginIndicatorGood.classList.remove('show');
    marginIndicatorExcellent.classList.remove('show');

    // Apply appropriate indicator
    if (winstmarge < 0) {
      winstmargeOutput.classList.add('margin-negative');
      marginIndicatorNegative.classList.add('show');
    } else if (winstmarge < 10) {
      winstmargeOutput.classList.add('margin-poor');
      marginIndicatorPoor.classList.add('show');
    } else if (winstmarge < 20) {
      winstmargeOutput.classList.add('margin-moderate');
      marginIndicatorModerate.classList.add('show');
    } else if (winstmarge < 30) {
      winstmargeOutput.classList.add('margin-good');
      marginIndicatorGood.classList.add('show');
    } else {
      winstmargeOutput.classList.add('margin-excellent');
      marginIndicatorExcellent.classList.add('show');
    }
  }

  function updateRoiIndicators(roi) {
    // Reset all classes and indicators
    roiOutput.classList.remove('margin-poor', 'margin-moderate', 'margin-good', 'margin-excellent');
    roiIndicatorPoor.classList.remove('show');
    roiIndicatorModerate.classList.remove('show');
    roiIndicatorDecent.classList.remove('show');
    roiIndicatorGood.classList.remove('show');
    roiIndicatorExcellent.classList.remove('show');

    // Apply appropriate indicator
    if (roi < 0) {
      roiOutput.classList.add('margin-poor');
      roiIndicatorPoor.classList.add('show');
    } else if (roi < 50) {
      roiOutput.classList.add('margin-moderate');
      roiIndicatorModerate.classList.add('show');
    } else if (roi < 100) {
      roiOutput.classList.add('margin-good');
      roiIndicatorDecent.classList.add('show');
    } else if (roi < 200) {
      roiOutput.classList.add('margin-good');
      roiIndicatorGood.classList.add('show');
    } else {
      roiOutput.classList.add('margin-excellent');
      roiIndicatorExcellent.classList.add('show');
    }
  }

  function updateShippingUI() {
    const platform = platformSelect.value;
    if (platform === 'bol') {
      bolShippingSection.style.display = 'block';
      shopifyPaymentSection.style.display = 'none';
      shippingMethodSection.style.display = 'none';
      amazonFeesSection.style.display = 'none';
    } else if (platform === 'shopify') {
      bolShippingSection.style.display = 'none';
      shopifyPaymentSection.style.display = 'block';
      shippingMethodSection.style.display = 'block';
      amazonFeesSection.style.display = 'none';
    } else if (platform === 'maxeda') {
      bolShippingSection.style.display = 'none';
      shopifyPaymentSection.style.display = 'none';
      shippingMethodSection.style.display = 'block';
      amazonFeesSection.style.display = 'none';
    } else if (platform === 'amazon') {
      bolShippingSection.style.display = 'none';
      shopifyPaymentSection.style.display = 'none';
      shippingMethodSection.style.display = 'block';
      amazonFeesSection.style.display = 'block';
    } else {
      bolShippingSection.style.display = 'none';
      shopifyPaymentSection.style.display = 'none';
      shippingMethodSection.style.display = 'none';
      amazonFeesSection.style.display = 'none';
    }
  }

  function updateUI() {
    const verkoopprijs = parseInputValue(verkoopprijsInput.value);
    const inkoopprijs = parseInputValue(inkoopprijsInput.value);
    const overigeKosten = parseInputValue(overigeKostenInput.value);
    const aantalStuks = parseInputValue(aantalStuksInput.value);
    const adKostenPerSale = parseInputValue(adKostenPerSaleInput.value);

    const btwBedrag = berekenBTWBedrag(verkoopprijs);
    const commissie = berekenCommissie(verkoopprijs);
    const verzendkosten = berekenVerzendkosten(verkoopprijs);
    
    const winstPerVerkoop = verkoopprijs - btwBedrag - commissie - verzendkosten - inkoopprijs - overigeKosten - adKostenPerSale;
    const geprognostiseerdeWinst = winstPerVerkoop * aantalStuks;
    
    const verkoopprijsExclBTW = verkoopprijs - btwBedrag;
    const winstmarge = verkoopprijsExclBTW > 0 ? (winstPerVerkoop / verkoopprijsExclBTW) * 100 : 0;
    
    const totaleInvestering = (inkoopprijs + overigeKosten) * aantalStuks;
    const investmentPerItem = inkoopprijs + overigeKosten;
    const roi = investmentPerItem > 0 ? (winstPerVerkoop / investmentPerItem) * 100 : 0;

    updateMarginIndicators(winstmarge);
    updateRoiIndicators(roi);

    const breakEvenPrijsInclBTW = berekenBreakEvenPrijs(
      inkoopprijs,
      overigeKosten,
      adKostenPerSale
    );

    btwOutput.textContent = `€${btwBedrag.toFixed(2)}`;
    commissieOutput.textContent = `€${commissie.toFixed(2)}`;
    totaleInvesteringOutput.textContent = `€${totaleInvestering.toFixed(2)}`;
    breakEvenPrijsOutput.textContent = `€${breakEvenPrijsInclBTW.toFixed(2)}`;
    shippingCostsOutput.textContent = `€${verzendkosten.toFixed(2)}`;
    winstOutput.textContent = `€${winstPerVerkoop.toFixed(2)}`;
    geprognostiseerdeWinstOutput.textContent = `€${geprognostiseerdeWinst.toFixed(2)}`;
    winstmargeOutput.textContent = `${winstmarge.toFixed(2)}%`;
    roiOutput.textContent = `${roi.toFixed(2)}%`;
  }

  // Add event listeners
  platformSelect.addEventListener("change", () => {
    updateShippingUI();
    updateUI();
  });
  shopifyPaymentSelect.addEventListener("change", updateUI);
  shippingMethodSelect.addEventListener("change", updateUI);
  verkoopprijsInput.addEventListener("input", updateUI);
  inkoopprijsInput.addEventListener("input", updateUI);
  lvbTariefSelect.addEventListener("change", updateUI);
  overigeKostenInput.addEventListener("input", updateUI);
  aantalStuksInput.addEventListener("input", updateUI);
  adKostenPerSaleInput.addEventListener("input", updateUI);
  amazonFeesInput.addEventListener("input", updateUI);

  // Initialize UI
  updateShippingUI();
  updateUI();
});

// nav bar start
const mobileNav = document.querySelector(".hamburger");
const navbar = document.querySelector(".menubar");

const toggleNav = () => {
  navbar.classList.toggle("active");
  mobileNav.classList.toggle("hamburger-active");
};
mobileNav.addEventListener("click", () => toggleNav());

// nav bar end