import React from 'react';
import { Sparkles, MapPin, ShieldCheck, Truck, Zap } from 'lucide-react';
import { useAuction } from '../../context/AuctionContext';

export const AnnouncementBar = () => {
  const marqueeItems = [
    'FREE DELIVERY OVER $99',
    'AUTHENTIC OVERSTOCK',
    'UP TO 75% OFF MSRP',
    'SCARBOROUGH PICKUP - 705 PROGRESS AVE #32',
    'TESTED & INSPECTED LOTS',
    'SAME-DAY WAREHOUSE DISPATCH'
  ];

  return (
    <aside className="announcement-marquee" aria-label="Announcement ticker and warehouse notice">
      <div className="marquee-track">
        <div className="marquee-group">
          {marqueeItems.concat(marqueeItems).map((text, idx) => (
            <React.Fragment key={`marquee-1-${idx}`}>
              <span className="marquee-item">
                <span className="marquee-star">★</span>
                <span>{text}</span>
              </span>
            </React.Fragment>
          ))}
        </div>
        <div className="marquee-group" aria-hidden="true">
          {marqueeItems.concat(marqueeItems).map((text, idx) => (
            <React.Fragment key={`marquee-2-${idx}`}>
              <span className="marquee-item">
                <span className="marquee-star">★</span>
                <span>{text}</span>
              </span>
            </React.Fragment>
          ))}
        </div>
      </div>
    </aside>
  );
};

export default AnnouncementBar;
