import React, { useState, useMemo } from 'react';

// Import all logos
import academorLogo from '../images/indus placement images/academor.jpg';
import accentureLogo from '../images/indus placement images/accenture-6.svg';
import adobeLogo from '../images/indus placement images/adobe.svg';
import cocaColaLogo from '../images/indus placement images/Coca-Cola_logo.svg';
import dcbBankLogo from '../images/indus placement images/DCB_BANK_reverse_logo_June_2011.jpg';
import forbesLogo from '../images/indus placement images/Forbes_and_Company_logo.png';
import harshaLogo from '../images/indus placement images/Harsha_logo.png';
import homeFirstLogo from '../images/indus placement images/Home-first-logo.jpg';
import iciciBankLogo from '../images/indus placement images/ICICI_Bank_Logo.svg';
import intechLogo from '../images/indus placement images/Intech-Business-AI.jpg';
import mitsubishiLogo from '../images/indus placement images/Mitsubishi_Electric_logo.png';
import ratnamaniLogo from '../images/indus placement images/RATNAMANI.NS_BIG-67b0ae2b.png';
import relianceIndLogo from '../images/indus placement images/Reliance-Industries-Limited-Logo-2.svg';
import relianceDigLogo from '../images/indus placement images/Reliance_Digital.svg';
import saintGobainLogo from '../images/indus placement images/SAINT_gobin.png';
import siemensLogo from '../images/indus placement images/Siemens-logo.jpg';
import simformLogo from '../images/indus placement images/Simform.png';
import sophosLogo from '../images/indus placement images/Sophos_logo.svg';
import tcsLogo from '../images/indus placement images/Tata_Consultancy_Services_old_logo.svg';
import tataMotorsLogo from '../images/indus placement images/Tata_Motors_Logo.svg';
import techMahindraLogo from '../images/indus placement images/Tech_Mahindra_New_Logo.svg.png';
import torrentPowerLogo from '../images/indus placement images/Torrent Power Logo SVG.svg';
import yazakiLogo from '../images/indus placement images/Yazaki_company_logo.svg';
import adaniGasLogo from '../images/indus placement images/adanigas.png';
import boschLogo from '../images/indus placement images/bosch.svg';
import bridgestoneLogo from '../images/indus placement images/bridgestone-26989.svg';
import capgeminiLogo from '../images/indus placement images/capgemini-logo-2017.svg';
import ciscoLogo from '../images/indus placement images/cisco_logo.png';
import cybercomLogo from '../images/indus placement images/cybercom_creation.png';
import cygnetinfotechLogo from '../images/indus placement images/cygnetinfotech.webp';
import federalBankLogo from '../images/indus placement images/federalbank.svg';
import flipkartLogo from '../images/indus placement images/flipkart.svg';
import futurenseLogo from '../images/indus placement images/futurense_logo.jpg';
import gatewayGroupLogo from '../images/indus placement images/gatewaygroup.svg';
import godrejLogo from '../images/indus placement images/godrej.svg';
import infosysLogo from '../images/indus placement images/infosys-technologies-logo.svg';
import jindalLogo from '../images/indus placement images/jindal-aluminium-limited-seeklogo.png';
import jioLogo from '../images/indus placement images/jio_logo.png';
import kotakBankLogo from '../images/indus placement images/kotak_bank.svg';
import meditabLogo from '../images/indus placement images/meditab_logo.webp';
import medkartPharmacyLogo from '../images/indus placement images/medkart-pharmacy-seeklogo.png';
import microsoftLogo from '../images/indus placement images/microsoft-6.svg';
import ninjacartLogo from '../images/indus placement images/ninjacart.webp';
import srkLogo from '../images/indus placement images/shree-ramkrishna-exports.png';
import silverTouchLogo from '../images/indus placement images/silver_touch_logo.png';
import sleepwellLogo from '../images/indus placement images/sleepwell_logo.jpg';
import torrecidLogo from '../images/indus placement images/torrecid_logo.jpg';
import torrentPharmaLogo from '../images/indus placement images/torrent-pharmaceuticals-seeklogo.png';
import volkswagenLogo from '../images/indus placement images/volkwagen.jpg';
import yesBankLogo from '../images/indus placement images/yesbank_logo.png';
import zeusLearningLogo from '../images/indus placement images/zeus_learning.webp';

function Placements() {
  const [searchTerm, setSearchTerm] = useState("");

  const stats = [
    { value: "26", label: "Architects", color: "#ee4036" },
    { value: "24.10", label: "IT & Computer Engineers", color: "#3cb5a0" },
    { value: "16", label: "Management Professionals", color: "#f7941d" },
    { value: "10", label: "Science & Technocrats", color: "#f7b11d" },
    { value: "12", label: "Aviation Engineers", color: "#4238ca" },
    { value: "8", label: "Designers", color: "#cf1d1d" },
    { value: "6.5", label: "Pharmacists", color: "#e84496" }
  ];

  const companies = [
    { name: "Accenture", logo: accentureLogo },
    { name: "Academor", logo: academorLogo },
    { name: "Adobe", logo: adobeLogo },
    { name: "Federal Bank", logo: federalBankLogo },
    { name: "Flipkart", logo: flipkartLogo },
    { name: "Bosch", logo: boschLogo },
    { name: "Capgemini", logo: capgeminiLogo },
    { name: "Bridgestone", logo: bridgestoneLogo },
    { name: "DCB Bank", logo: dcbBankLogo },
    { name: "ICICI Bank", logo: iciciBankLogo },
    { name: "Harsha Engineers", logo: harshaLogo },
    { name: "Gateway Group", logo: gatewayGroupLogo },
    { name: "Infosys", logo: infosysLogo },
    { name: "Cygnet Infotech", logo: cygnetinfotechLogo },
    { name: "Cybercom", logo: cybercomLogo },
    { name: "Intech", logo: intechLogo },
    { name: "Kotak Mahindra Bank", logo: kotakBankLogo },
    { name: "Godrej", logo: godrejLogo },
    { name: "Jindal", logo: jindalLogo },
    { name: "Medkart Pharmacy", logo: medkartPharmacyLogo },
    { name: "Home First", logo: homeFirstLogo },
    { name: "Reliance Industries", logo: relianceIndLogo },
    { name: "Microsoft", logo: microsoftLogo },
    { name: "Torrent Power", logo: torrentPowerLogo },
    { name: "Volkswagen", logo: volkswagenLogo },
    { name: "TCS", logo: tcsLogo },
    { name: "Sophos", logo: sophosLogo },
    { name: "Tata Motors", logo: tataMotorsLogo },
    { name: "Mitsubishi Electric", logo: mitsubishiLogo },
    { name: "Coca-Cola", logo: cocaColaLogo },
    { name: "Zeus Learning", logo: zeusLearningLogo },
    { name: "Yazaki", logo: yazakiLogo },
    { name: "Saint-Gobain", logo: saintGobainLogo },
    { name: "Ratnamani", logo: ratnamaniLogo },
    { name: "Reliance Digital", logo: relianceDigLogo },
    { name: "Ninjacart", logo: ninjacartLogo },
    { name: "Meditab", logo: meditabLogo },
    { name: "Tech Mahindra", logo: techMahindraLogo },
    { name: "Simform", logo: simformLogo },
    { name: "Forbes", logo: forbesLogo },
    { name: "Siemens", logo: siemensLogo },
    { name: "Torrecid", logo: torrecidLogo },
    { name: "Yes Bank", logo: yesBankLogo },
    { name: "Silver Touch", logo: silverTouchLogo },
    { name: "Sleepwell", logo: sleepwellLogo },
    { name: "Futurense", logo: futurenseLogo },
    { name: "Jio", logo: jioLogo },
    { name: "Cisco", logo: ciscoLogo },
    { name: "Adani Gas", logo: adaniGasLogo },
    { name: "Torrent Pharma", logo: torrentPharmaLogo },
    { name: "SRK", logo: srkLogo }
  ];

  const filteredCompanies = useMemo(() => {
    return companies.filter(company => 
      company.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm, companies]);

  return (
    <div className="fade-in pb-24 h-full overflow-y-auto pr-2">
      <header className="mb-10 flex flex-col md:flex-row md:items-end md:justify-between gap-6">
        <div>
          <h1 className="text-4xl md:text-5xl font-bold text-black leading-tight mb-4">
            Placements & Stats
          </h1>
          <p className="text-lg text-gray-500">Excellence in career opportunities and industry exposure</p>
        </div>
        
        {/* Search Bar */}
        <div className="relative w-full md:w-80">
          <span className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </span>
          <input
            type="text"
            placeholder="Search company..."
            className="w-full bg-white border border-gray-200 rounded-2xl py-3 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-brand-brown/20 focus:border-brand-brown transition-all shadow-sm text-black placeholder-gray-400"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </header>

      {/* Stats Section */}
      <section className="mb-16">
        <h2 className="text-2xl font-bold text-black mb-8 border-l-4 border-brand-brown pl-4">Placement Offers (Lakhs per Year)</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-6">
          {stats.map((stat, index) => (
            <div 
              key={index} 
              style={{ backgroundColor: stat.color }}
              className="p-10 rounded-[2.5rem] text-white text-center shadow-xl transition-all cursor-default"
            >
              <div className="text-4xl md:text-5xl font-black mb-2">{stat.value}</div>
              <div className="text-xs uppercase font-extrabold tracking-wider leading-tight opacity-90">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Companies Section */}
      <section className="pb-20">
        <div className="flex items-baseline justify-between mb-8">
          <h2 className="text-2xl font-bold text-black border-l-4 border-brand-brown pl-4">Placements in Campus</h2>
          {searchTerm && (
            <p className="text-sm text-gray-500 italic">
              Showing {filteredCompanies.length} result{filteredCompanies.length !== 1 ? 's' : ''}
            </p>
          )}
        </div>
        
        <div className="grid grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-6">
          {filteredCompanies.length > 0 ? (
            filteredCompanies.map((company, index) => {
              const isNoPadding = ["Simform", "Silver Touch", "Ninjacart", "Adani Gas", "Reliance Industries", "Home First", "Cybercom", "Cygnet Infotech", "Bridgestone", "Capgemini"].includes(company.name);
              let scaleClass = "";
              if (company.name === "Reliance Industries") scaleClass = "scale-[2.0]";
              else if (["Simform", "Home First", "Bridgestone"].includes(company.name)) scaleClass = "scale-[1.7]";
              else if (["Cybercom", "Cygnet Infotech"].includes(company.name)) scaleClass = "scale-[1.5]";
              else if (["Silver Touch", "Ninjacart", "Adani Gas", "Capgemini"].includes(company.name)) scaleClass = "scale-[1.1]";
              
              return (
                <div 
                  key={index} 
                  className={`bg-white h-40 rounded-3xl shadow-sm border border-gray-100 flex flex-col items-center justify-center text-center transition-all hover:shadow-md hover:border-brand-brown/20 group overflow-hidden ${isNoPadding ? "p-3" : "p-6"}`}
                >
                  <div className="flex-1 flex items-center justify-center w-full min-h-0">
                    <img 
                      src={company.logo} 
                      alt={company.name} 
                      className={`max-h-full max-w-full object-contain transition-all duration-300 transform ${scaleClass} ${company.name === "Reliance Industries" ? "block mx-auto" : ""}`} 
                    />
                  </div>
                  <div className="mt-2 text-[10px] font-bold text-gray-400 uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap overflow-hidden text-ellipsis w-full px-2">
                    {company.name}
                  </div>
                </div>
              );
            })
          ) : (
            <div className="col-span-full py-20 text-center">
              <div className="text-gray-300 mb-4">
                <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </div>
              <p className="text-xl font-medium text-gray-400">No companies match "{searchTerm}"</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

export default Placements;
