import Shell from '../shell';
import SectionList from '../components/SectionList';
import {
  teachingData,
  serviceData,
  talksData,
  membershipData,
} from '../data/loadContent';

export default function Teaching() {
  return (
    <Shell>
      <SectionList id="teaching" heading={teachingData.heading} items={teachingData.items} />
      <SectionList id="service" heading={serviceData.heading} items={serviceData.service} />
      <SectionList
        id="panels"
        heading={serviceData.proposalPanelsHeading}
        items={serviceData.proposalPanels}
        variant="pills"
      />
      <SectionList id="talks" heading={talksData.heading} items={talksData.items} />
      <SectionList
        id="membership"
        heading={membershipData.heading}
        items={membershipData.items}
        variant="pills"
      />
    </Shell>
  );
}
