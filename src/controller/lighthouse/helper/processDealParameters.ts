interface DealParameters {
  miner?: string[];
  num_copies?: number | null;
  repair_threshold?: number | null;
  renew_threshold?: number | null;
  add_mock_data?: number | null;
  deal_duration?: number;
  network?: string;
}

interface ProcessedDealParameters {
  fileId: string,
  miner: string[];
  num_copies: number | null;
  repair_threshold: number | null;
  renew_threshold: number | null;
  add_mock_data: number | null;
  deal_duration: number;
  network: string;
}

const processDealParam = (
  dealParam: DealParameters | null,
  id: string,
): ProcessedDealParameters | null => {

  try {
    if (!dealParam) {
      return null; // Comment this line in production
    }

    const dealData: ProcessedDealParameters = {
      fileId: id,
      miner: [],
      num_copies: 2,
      repair_threshold: 28800,
      renew_threshold: 172800, // 2880 epoch per day
      add_mock_data: 2,
      deal_duration: 1537920,
      network: 'mainnet',
    };

    // Handle Miner
    if (dealParam.miner?.length) {
      dealData.miner = dealParam.miner.slice(0, 4);
    }

    if (dealParam.num_copies === null) {
      dealData.num_copies = null;
    } else if (dealParam.num_copies !== undefined) {
      dealData.num_copies = Math.min(dealParam.num_copies, 4)?Math.min(dealParam.num_copies, 4):2;
    }

    if (dealParam.repair_threshold === null) {
      dealData.repair_threshold = null;
    } else if (dealParam.repair_threshold !== undefined) {
      dealData.repair_threshold = Math.max(dealParam.repair_threshold, 240)?Math.max(dealParam.repair_threshold, 240):240;
    }

    if (dealParam.renew_threshold === null) {
      dealData.renew_threshold = null;
    } else if (dealParam.renew_threshold !== undefined) {
      dealData.renew_threshold = Math.max(dealParam.renew_threshold, 240)?Math.max(dealParam.renew_threshold, 240):240;
    }

    if (dealParam.add_mock_data === null) {
      dealData.add_mock_data = null;
    } else if (dealParam.add_mock_data !== undefined) {
      dealData.add_mock_data = Math.min(
        Math.max(dealParam.add_mock_data, 0),
        1024,
      )?
      dealData.add_mock_data = Math.min(
        Math.max(dealParam.add_mock_data, 0),
        1024,
      )
      :
      null;
    }

    if (dealParam.deal_duration) {
      dealData.deal_duration = 1537920;
    }

    if (dealParam.network === 'calibration') {
      dealData.network = 'calibration';
    }

    return dealData;
  } catch (err) {
    console.log("Error process deal param")
    console.error(err); // Comment this line in production
    return null;
  }
};

export default processDealParam;
