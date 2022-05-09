import React, { Fragment, useEffect } from "react";
import { Button } from "@mui/material";
import { Route, useHistory, useRouteMatch } from "react-router-dom";
import EnhancedTable from "../../components/Atoms/table/Table";
import axios from "axios";
import OwnerOpDetails from "./OwnerOpLoadDetail";
import OwnerOpBid from "./OwnerOpBid";

const testData = {
  totalResults: 229,
  results: [
    {
      loadNumber: 393282023,
      origin: {
        warehouseCode: "W62404098",
        city: "Nogales",
        stateCode: "AZ",
        postalCode: "85621",
        county: "Santa Cruz Co.",
        countryCode: "US",
        coordinate: {
          lat: 31.3698005,
          lon: -110.92749,
        },
        name: "CWS Nogales",
        scheduleRequest: "O",
      },
      destination: {
        warehouseCode: "W1101129",
        city: "SAN DIEGO",
        stateCode: "CA",
        postalCode: "92121",
        county: "San Diego",
        countryCode: "US",
        coordinate: {
          lat: 32.8844985,
          lon: -117.1735,
        },
        name: "Crest Beverage, LLC",
        scheduleRequest: "A",
      },
      distance: {
        miles: 470,
        kilometers: 756,
      },
      weight: {
        kilograms: 19728.4261,
        pounds: 43493.77,
      },
      readyBy: "2022-04-22T00:00:00.0000000-05:00",
      deliverBy: "2022-04-25T00:00:00.0000000-05:00",
      equipment: {
        length: {
          standard: 53,
          metric: 16.1544,
        },
      },
      specializedEquipment: {
        description: "",
        length: {
          standard: 53,
          metric: 16.1544,
        },
      },
      hasDriverWork: false,
      stopCount: 2,
      carrierTier: "None",
      isOkToAdvertise: true,
      isDatOk: false,
      isHazMat: false,
      isTeamLoad: false,
      isRegulatedByStf: false,
      isTankerEndorsementRequired: false,
      loadPriorityRank: 1,
      sourceUom: "Standard",
      regionCode: "NA",
      contact: {
        phoneNumber: "9158383869",
        name: "Jesus Armendariz",
        employeeCode: "ARMEJES",
        emailAddress: "Jesus.Armendariz@chrobinson.com",
      },
      rating: "CRI",
      modes: ["R", "V"],
      hasDropTrailer: false,
      deliveryAvailableDate: "2022-04-25T00:00:00.0000000-05:00",
      stops: [
        {
          stopNumber: 0,
          sequenceNumber: 0,
          stopType: "Pick",
          calculatedArriveByStartDateTime: "2022-04-22T09:00:00.0000000-05:00",
          calculatedArriveByEndDateTime: "2022-04-22T16:30:00.0000000-05:00",
          maxWeight: {
            kilograms: 19728.4261,
            pounds: 43493.77,
          },
          warehouseInformation: {
            warehouseCode: "W62404098",
            city: "Nogales",
            stateCode: "AZ",
            postalCode: "85621",
            county: "Santa Cruz Co.",
            countryCode: "US",
            coordinate: {
              lat: 31.3698005,
              lon: -110.92749,
            },
            openTime: "PT9H",
            closeTime: "PT16H30M",
            name: "CWS Nogales",
            scheduleRequest: "O",
          },
          isScheduledOpenTimeSpecified: true,
          isScheduledCloseTimeSpecified: true,
        },
        {
          stopNumber: 1,
          sequenceNumber: 1,
          stopType: "Drop",
          calculatedArriveByStartDateTime: "2022-04-25T07:00:00.0000000-05:00",
          calculatedArriveByEndDateTime: "2022-04-25T07:00:00.0000000-05:00",
          maxWeight: {
            kilograms: 19728.4261,
            pounds: 43493.77,
          },
          warehouseInformation: {
            warehouseCode: "W1101129",
            city: "SAN DIEGO",
            stateCode: "CA",
            postalCode: "92121",
            county: "San Diego",
            countryCode: "US",
            coordinate: {
              lat: 32.8844985,
              lon: -117.1735,
            },
            openTime: "PT7H",
            closeTime: "PT7H",
            name: "Crest Beverage, LLC",
            scheduleRequest: "A",
          },
          isScheduledOpenTimeSpecified: true,
          isScheduledCloseTimeSpecified: true,
        },
      ],
      pickUpByDate: "2022-04-22T00:00:00.0000000-05:00",
      activityDate: "2022-04-22T00:00:00.0000000-05:00",
      minimumLogipoints: 0.8,
      calculatedPickUpByDateTime: "2022-04-22T09:00:00.0000000-05:00",
      calculatedDeliverByDateTime: "2022-04-25T07:00:00.0000000-05:00",
      assignedRep: "WebExcl",
      isTest: false,
      isWebDisplayable: true,
      availableLoadCosts: [],
      createdDateTime: "2022-04-14T21:10:52.4013506Z",
      updatedDateTime: "2022-04-18T20:03:04.9830690Z",
      load_join: "load",
      reeferTemperature: {
        metricUom: "Fahrenheit",
        standardUom: "Fahrenheit",
      },
      availableForPickUp: {
        minimum: "2022-04-22T00:00:00.0000000",
        maximum: "2022-04-22T00:00:00.0000000",
      },
      minimumCargoManagementPoints: 0,
      isNotOfferable: false,
      offerableExcludedCarriers: [],
      deadHeadDistance: 925.617519,
    },
    {
      loadNumber: 393354545,
      origin: {
        warehouseCode: "W74465352",
        city: "Tolleson",
        stateCode: "AZ",
        postalCode: "85353",
        county: "Maricopa County",
        countryCode: "US",
        coordinate: {
          lat: 33.4468002,
          lon: -112.22109,
        },
        name: "Pepsico- #2172 - Quaker Oats - OUTBOUND",
        scheduleRequest: "A",
      },
      destination: {
        warehouseCode: "W5810632",
        city: "Ventura",
        stateCode: "CA",
        postalCode: "93001",
        countryCode: "US",
        coordinate: {
          lat: 34.3274993,
          lon: -119.29139,
        },
        name: "PBG",
        scheduleRequest: "A",
      },
      distance: {
        miles: 428,
        kilometers: 688,
      },
      weight: {
        kilograms: 19687.2536,
        pounds: 43403,
      },
      readyBy: "2022-04-19T00:00:00.0000000-05:00",
      deliverBy: "2022-04-26T00:00:00.0000000-05:00",
      equipment: {
        length: {
          standard: 53,
          metric: 16.1544,
        },
      },
      specializedEquipment: {
        description: "",
        length: {
          standard: 53,
          metric: 16.1544,
        },
      },
      hasDriverWork: false,
      stopCount: 2,
      carrierTier: "None",
      isOkToAdvertise: true,
      isDatOk: false,
      isHazMat: false,
      isTeamLoad: false,
      isRegulatedByStf: false,
      isTankerEndorsementRequired: false,
      loadPriorityRank: 1,
      sourceUom: "Standard",
      regionCode: "NA",
      contact: {
        phoneNumber: "4806077620",
        name: "Jacqui Deleon",
        employeeCode: "DELEJAC",
        emailAddress: "Jacqui.DeLeon@chrobinson.com",
      },
      rating: "CRI",
      modes: ["R", "V"],
      hasDropTrailer: false,
      deliveryAvailableDate: "2022-04-20T00:00:00.0000000-05:00",
      stops: [
        {
          stopNumber: 0,
          sequenceNumber: 1,
          stopType: "Pick",
          calculatedArriveByStartDateTime: "2022-04-25T15:00:00.0000000-05:00",
          calculatedArriveByEndDateTime: "2022-04-25T15:00:00.0000000-05:00",
          maxWeight: {
            kilograms: 19687.2536,
            pounds: 43403,
          },
          warehouseInformation: {
            warehouseCode: "W74465352",
            city: "Tolleson",
            stateCode: "AZ",
            postalCode: "85353",
            county: "Maricopa County",
            countryCode: "US",
            coordinate: {
              lat: 33.4468002,
              lon: -112.22109,
            },
            openTime: "PT6H",
            closeTime: "PT23H",
            name: "Pepsico- #2172 - Quaker Oats - OUTBOUND",
            scheduleRequest: "A",
          },
          isScheduledOpenTimeSpecified: true,
          isScheduledCloseTimeSpecified: true,
        },
        {
          stopNumber: 1,
          sequenceNumber: 0,
          stopType: "Drop",
          calculatedArriveByStartDateTime: "2022-04-26T08:00:00.0000000-05:00",
          calculatedArriveByEndDateTime: "2022-04-26T08:00:00.0000000-05:00",
          maxWeight: {
            kilograms: 19687.2536,
            pounds: 43403,
          },
          warehouseInformation: {
            warehouseCode: "W5810632",
            city: "Ventura",
            stateCode: "CA",
            postalCode: "93001",
            countryCode: "US",
            coordinate: {
              lat: 34.3274993,
              lon: -119.29139,
            },
            openTime: "PT9H",
            closeTime: "PT16H",
            name: "PBG",
            scheduleRequest: "A",
          },
          isScheduledOpenTimeSpecified: true,
          isScheduledCloseTimeSpecified: true,
        },
      ],
      pickUpByDate: "2022-04-25T00:00:00.0000000-05:00",
      activityDate: "2022-04-25T00:00:00.0000000-05:00",
      minimumLogipoints: 0,
      calculatedPickUpByDateTime: "2022-04-25T15:00:00.0000000-05:00",
      calculatedDeliverByDateTime: "2022-04-26T08:00:00.0000000-05:00",
      assignedRep: "WebExcl",
      isTest: false,
      isWebDisplayable: true,
      availableLoadCosts: [],
      createdDateTime: "2022-04-19T19:36:17.4465614Z",
      updatedDateTime: "2022-04-19T19:36:54.1502109Z",
      load_join: "load",
      reeferTemperature: {
        metricUom: "Fahrenheit",
        standardUom: "Fahrenheit",
      },
      availableForPickUp: {
        minimum: "2022-04-19T00:00:00.0000000",
        maximum: "2022-04-25T00:00:00.0000000",
      },
      minimumCargoManagementPoints: 0,
      isNotOfferable: false,
      offerableExcludedCarriers: [],
      deadHeadDistance: 742.633645,
    },
    {
      loadNumber: 393570121,
      origin: {
        warehouseCode: "W61654519",
        city: "WADDELL",
        stateCode: "AZ",
        postalCode: "85355",
        countryCode: "US",
        coordinate: {
          lat: 33.5794982,
          lon: -112.3936,
        },
        name: "Rauch- Red Bull",
        scheduleRequest: "A",
      },
      destination: {
        warehouseCode: "W8297063",
        city: "CARSON",
        stateCode: "CA",
        postalCode: "90810-1652",
        county: "Los Angeles",
        countryCode: "US",
        coordinate: {
          lat: 33.8284988,
          lon: -118.235,
        },
        name: "Red Bull C/O Geodis fomerly OHL",
        scheduleRequest: "A",
      },
      distance: {
        miles: 364,
        kilometers: 585,
      },
      weight: {
        kilograms: 19921.4749,
        pounds: 43919.37,
      },
      readyBy: "2022-04-22T00:00:00.0000000-05:00",
      deliverBy: "2022-04-25T00:00:00.0000000-05:00",
      equipment: {
        length: {
          standard: 53,
          metric: 16.1544,
        },
      },
      specializedEquipment: {
        description: "",
        length: {
          standard: 53,
          metric: 16.1544,
        },
      },
      hasDriverWork: false,
      stopCount: 2,
      carrierTier: "None",
      isOkToAdvertise: true,
      isDatOk: false,
      isHazMat: false,
      isTeamLoad: false,
      isRegulatedByStf: false,
      isTankerEndorsementRequired: false,
      loadPriorityRank: 1,
      sourceUom: "Standard",
      regionCode: "NA",
      contact: {
        phoneNumber: "4806077620",
        name: "Amber Swale",
        employeeCode: "SWALAMB",
        emailAddress: "Amber.Swale@chrobinson.com",
      },
      rating: "S",
      modes: ["V"],
      hasDropTrailer: false,
      deliveryAvailableDate: "2022-04-25T00:00:00.0000000-05:00",
      stops: [
        {
          stopNumber: 0,
          sequenceNumber: 0,
          stopType: "Pick",
          calculatedArriveByStartDateTime: "2022-04-22T10:00:00.0000000-05:00",
          calculatedArriveByEndDateTime: "2022-04-22T10:00:00.0000000-05:00",
          maxWeight: {
            kilograms: 19921.4749,
            pounds: 43919.37,
          },
          warehouseInformation: {
            warehouseCode: "W61654519",
            city: "WADDELL",
            stateCode: "AZ",
            postalCode: "85355",
            countryCode: "US",
            coordinate: {
              lat: 33.5794982,
              lon: -112.3936,
            },
            openTime: "PT6H",
            closeTime: "PT20H",
            name: "Rauch- Red Bull",
            scheduleRequest: "A",
          },
          isScheduledOpenTimeSpecified: true,
          isScheduledCloseTimeSpecified: true,
        },
        {
          stopNumber: 1,
          sequenceNumber: 1,
          stopType: "Drop",
          calculatedArriveByStartDateTime: "2022-04-25T16:00:00.0000000-05:00",
          calculatedArriveByEndDateTime: "2022-04-25T16:00:00.0000000-05:00",
          maxWeight: {
            kilograms: 19921.4749,
            pounds: 43919.37,
          },
          warehouseInformation: {
            warehouseCode: "W8297063",
            city: "CARSON",
            stateCode: "CA",
            postalCode: "90810-1652",
            county: "Los Angeles",
            countryCode: "US",
            coordinate: {
              lat: 33.8284988,
              lon: -118.235,
            },
            openTime: "PT5H",
            closeTime: "PT21H",
            name: "Red Bull C/O Geodis fomerly OHL",
            scheduleRequest: "A",
          },
          isScheduledOpenTimeSpecified: true,
          isScheduledCloseTimeSpecified: true,
        },
      ],
      pickUpByDate: "2022-04-22T00:00:00.0000000-05:00",
      activityDate: "2022-04-22T00:00:00.0000000-05:00",
      minimumLogipoints: 0.95,
      calculatedPickUpByDateTime: "2022-04-22T10:00:00.0000000-05:00",
      calculatedDeliverByDateTime: "2022-04-25T16:00:00.0000000-05:00",
      assignedRep: "WebExcl",
      isTest: false,
      isWebDisplayable: true,
      availableLoadCosts: [],
      createdDateTime: "2022-04-12T14:10:35.7352304Z",
      updatedDateTime: "2022-04-15T17:28:57.1393474Z",
      load_join: "load",
      reeferTemperature: {
        metricUom: "Fahrenheit",
        standardUom: "Fahrenheit",
      },
      availableForPickUp: {
        minimum: "2022-04-22T00:00:00.0000000",
        maximum: "2022-04-22T00:00:00.0000000",
      },
      minimumCargoManagementPoints: 30,
      isNotOfferable: false,
      offerableExcludedCarriers: [
        "T1553842",
        "T3028212",
        "T115032",
        "T4308639",
        "T5337907",
        "T1534160",
        "T2100",
        "T5278808",
      ],
      deadHeadDistance: 739.365853,
    },
    {
      loadNumber: 393570397,
      origin: {
        warehouseCode: "W61654519",
        city: "WADDELL",
        stateCode: "AZ",
        postalCode: "85355",
        countryCode: "US",
        coordinate: {
          lat: 33.5794982,
          lon: -112.3936,
        },
        name: "Rauch- Red Bull",
        scheduleRequest: "A",
      },
      destination: {
        warehouseCode: "W8297063",
        city: "CARSON",
        stateCode: "CA",
        postalCode: "90810-1652",
        county: "Los Angeles",
        countryCode: "US",
        coordinate: {
          lat: 33.8284988,
          lon: -118.235,
        },
        name: "Red Bull C/O Geodis fomerly OHL",
        scheduleRequest: "A",
      },
      distance: {
        miles: 364,
        kilometers: 585,
      },
      weight: {
        kilograms: 19971.4017,
        pounds: 44029.44,
      },
      readyBy: "2022-04-22T00:00:00.0000000-05:00",
      deliverBy: "2022-04-25T00:00:00.0000000-05:00",
      equipment: {
        length: {
          standard: 53,
          metric: 16.1544,
        },
        width: {
          standard: 0,
          metric: 0,
        },
        height: {
          standard: 0,
          metric: 0,
        },
      },
      specializedEquipment: {
        description: "",
        length: {
          standard: 53,
          metric: 16.1544,
        },
        width: {
          standard: 0,
          metric: 0,
        },
        height: {
          standard: 0,
          metric: 0,
        },
      },
      hasDriverWork: false,
      stopCount: 2,
      carrierTier: "None",
      isOkToAdvertise: true,
      isDatOk: false,
      isHazMat: false,
      isTeamLoad: false,
      isRegulatedByStf: false,
      isTankerEndorsementRequired: false,
      loadPriorityRank: 1,
      sourceUom: "Standard",
      regionCode: "NA",
      contact: {
        phoneNumber: "4806077620",
        name: "Amber Swale",
        employeeCode: "SWALAMB",
        emailAddress: "Amber.Swale@chrobinson.com",
      },
      rating: "S",
      modes: ["V"],
      hasDropTrailer: false,
      deliveryAvailableDate: "2022-04-25T00:00:00.0000000-05:00",
      stops: [
        {
          stopNumber: 0,
          sequenceNumber: 0,
          stopType: "Pick",
          calculatedArriveByStartDateTime: "2022-04-22T13:00:00.0000000-05:00",
          calculatedArriveByEndDateTime: "2022-04-22T13:00:00.0000000-05:00",
          maxWeight: {
            kilograms: 19971.4017,
            pounds: 44029.44,
          },
          warehouseInformation: {
            warehouseCode: "W61654519",
            city: "WADDELL",
            stateCode: "AZ",
            postalCode: "85355",
            countryCode: "US",
            coordinate: {
              lat: 33.5794982,
              lon: -112.3936,
            },
            openTime: "PT6H",
            closeTime: "PT20H",
            name: "Rauch- Red Bull",
            scheduleRequest: "A",
          },
          isScheduledOpenTimeSpecified: true,
          isScheduledCloseTimeSpecified: true,
        },
        {
          stopNumber: 1,
          sequenceNumber: 1,
          stopType: "Drop",
          calculatedArriveByStartDateTime: "2022-04-25T07:00:00.0000000-05:00",
          calculatedArriveByEndDateTime: "2022-04-25T07:00:00.0000000-05:00",
          maxWeight: {
            kilograms: 19971.4017,
            pounds: 44029.44,
          },
          warehouseInformation: {
            warehouseCode: "W8297063",
            city: "CARSON",
            stateCode: "CA",
            postalCode: "90810-1652",
            county: "Los Angeles",
            countryCode: "US",
            coordinate: {
              lat: 33.8284988,
              lon: -118.235,
            },
            openTime: "PT5H",
            closeTime: "PT21H",
            name: "Red Bull C/O Geodis fomerly OHL",
            scheduleRequest: "A",
          },
          isScheduledOpenTimeSpecified: true,
          isScheduledCloseTimeSpecified: true,
        },
      ],
      pickUpByDate: "2022-04-22T00:00:00.0000000-05:00",
      activityDate: "2022-04-22T00:00:00.0000000-05:00",
      minimumLogipoints: 0.95,
      calculatedPickUpByDateTime: "2022-04-22T13:00:00.0000000-05:00",
      calculatedDeliverByDateTime: "2022-04-25T07:00:00.0000000-05:00",
      assignedRep: "WebExcl",
      isTest: false,
      isWebDisplayable: true,
      availableLoadCosts: [],
      createdDateTime: "2022-04-06T14:17:08.7312031Z",
      updatedDateTime: "2022-04-15T15:47:07.9473278Z",
      load_join: "load",
      reeferTemperature: {
        metricUom: "Fahrenheit",
        standardUom: "Fahrenheit",
      },
      availableForPickUp: {
        minimum: "2022-04-22T00:00:00.0000000",
        maximum: "2022-04-22T00:00:00.0000000",
      },
      minimumCargoManagementPoints: 30,
      isNotOfferable: false,
      offerableExcludedCarriers: [
        "T1553842",
        "T3028212",
        "T115032",
        "T4308639",
        "T5337907",
        "T1534160",
        "T2100",
        "T5278808",
      ],
      deadHeadDistance: 739.365853,
    },
    {
      loadNumber: 393570428,
      origin: {
        warehouseCode: "W61654519",
        city: "WADDELL",
        stateCode: "AZ",
        postalCode: "85355",
        countryCode: "US",
        coordinate: {
          lat: 33.5794982,
          lon: -112.3936,
        },
        name: "Rauch- Red Bull",
        scheduleRequest: "A",
      },
      destination: {
        warehouseCode: "W8297063",
        city: "CARSON",
        stateCode: "CA",
        postalCode: "90810-1652",
        county: "Los Angeles",
        countryCode: "US",
        coordinate: {
          lat: 33.8284988,
          lon: -118.235,
        },
        name: "Red Bull C/O Geodis fomerly OHL",
        scheduleRequest: "A",
      },
      distance: {
        miles: 364,
        kilometers: 585,
      },
      weight: {
        kilograms: 19172.5446,
        pounds: 42268.26,
      },
      readyBy: "2022-04-22T00:00:00.0000000-05:00",
      deliverBy: "2022-04-25T00:00:00.0000000-05:00",
      equipment: {
        length: {
          standard: 53,
          metric: 16.1544,
        },
        width: {
          standard: 0,
          metric: 0,
        },
        height: {
          standard: 0,
          metric: 0,
        },
      },
      specializedEquipment: {
        description: "",
        length: {
          standard: 53,
          metric: 16.1544,
        },
        width: {
          standard: 0,
          metric: 0,
        },
        height: {
          standard: 0,
          metric: 0,
        },
      },
      hasDriverWork: false,
      stopCount: 2,
      carrierTier: "None",
      isOkToAdvertise: true,
      isDatOk: false,
      isHazMat: false,
      isTeamLoad: false,
      isRegulatedByStf: false,
      isTankerEndorsementRequired: false,
      loadPriorityRank: 1,
      sourceUom: "Standard",
      regionCode: "NA",
      contact: {
        phoneNumber: "4806077620",
        name: "Amber Swale",
        employeeCode: "SWALAMB",
        emailAddress: "Amber.Swale@chrobinson.com",
      },
      rating: "S",
      modes: ["V"],
      hasDropTrailer: false,
      deliveryAvailableDate: "2022-04-25T00:00:00.0000000-05:00",
      stops: [
        {
          stopNumber: 0,
          sequenceNumber: 0,
          stopType: "Pick",
          calculatedArriveByStartDateTime: "2022-04-22T11:00:00.0000000-05:00",
          calculatedArriveByEndDateTime: "2022-04-22T11:00:00.0000000-05:00",
          maxWeight: {
            kilograms: 19172.5446,
            pounds: 42268.26,
          },
          warehouseInformation: {
            warehouseCode: "W61654519",
            city: "WADDELL",
            stateCode: "AZ",
            postalCode: "85355",
            countryCode: "US",
            coordinate: {
              lat: 33.5794982,
              lon: -112.3936,
            },
            openTime: "PT6H",
            closeTime: "PT20H",
            name: "Rauch- Red Bull",
            scheduleRequest: "A",
          },
          isScheduledOpenTimeSpecified: true,
          isScheduledCloseTimeSpecified: true,
        },
        {
          stopNumber: 1,
          sequenceNumber: 1,
          stopType: "Drop",
          calculatedArriveByStartDateTime: "2022-04-25T09:00:00.0000000-05:00",
          calculatedArriveByEndDateTime: "2022-04-25T09:00:00.0000000-05:00",
          maxWeight: {
            kilograms: 19172.5446,
            pounds: 42268.26,
          },
          warehouseInformation: {
            warehouseCode: "W8297063",
            city: "CARSON",
            stateCode: "CA",
            postalCode: "90810-1652",
            county: "Los Angeles",
            countryCode: "US",
            coordinate: {
              lat: 33.8284988,
              lon: -118.235,
            },
            openTime: "PT5H",
            closeTime: "PT21H",
            name: "Red Bull C/O Geodis fomerly OHL",
            scheduleRequest: "A",
          },
          isScheduledOpenTimeSpecified: true,
          isScheduledCloseTimeSpecified: true,
        },
      ],
      pickUpByDate: "2022-04-22T00:00:00.0000000-05:00",
      activityDate: "2022-04-22T00:00:00.0000000-05:00",
      minimumLogipoints: 0.95,
      calculatedPickUpByDateTime: "2022-04-22T11:00:00.0000000-05:00",
      calculatedDeliverByDateTime: "2022-04-25T09:00:00.0000000-05:00",
      assignedRep: "",
      isTest: false,
      isWebDisplayable: true,
      availableLoadCosts: [],
      createdDateTime: "2022-04-15T15:41:26.1588145Z",
      updatedDateTime: "2022-04-19T13:34:47.4760491Z",
      load_join: "load",
      reeferTemperature: {
        metricUom: "Fahrenheit",
        standardUom: "Fahrenheit",
      },
      availableForPickUp: {
        minimum: "2022-04-22T00:00:00.0000000",
        maximum: "2022-04-22T00:00:00.0000000",
      },
      minimumCargoManagementPoints: 30,
      isNotOfferable: false,
      offerableExcludedCarriers: [
        "T1553842",
        "T3028212",
        "T115032",
        "T4308639",
        "T5337907",
        "T1534160",
        "T2100",
        "T5278808",
      ],
      deadHeadDistance: 739.365853,
    },
  ],
};

const OwnerOperator = () => {
  const { path } = useRouteMatch(),
    history = useHistory();

  var data = JSON.stringify({
    pageIndex: 0,
    pageSize: 100,
    regionCode: "NA",
    modes: ["V", "R"],
    originRadiusSearch: {
      coordinate: {
        lat: 37.775,
        lon: -122.41833,
      },
      radius: {
        value: 1000,
        unitOfMeasure: "Standard",
      },
    },
    destinationRadiusSearch: {
      coordinate: {
        lat: 37.775,
        lon: -122.41833,
      },
      radius: {
        value: 1000,
        unitOfMeasure: "Standard",
      },
    },
    loadDistanceRange: {
      unitOfMeasure: "Standard",
      min: 0,
      max: 5000,
    },
    loadWeightRange: {
      unitOfMeasure: "Standard",
      min: 0,
      max: 48000,
    },
    equipmentLengthRange: {
      unitOfMeasure: "Standard",
      min: 0,
      max: 53,
    },
    availableForPickUpByDateRange: {
      min: "2022-05-03",
      max: "2022-05-11",
    },
    teamLoad: true,
    stfLoad: true,
    hazMatLoad: true,
    tankerLoad: true,
    chemicalSolutionLoad: true,
    highValueLoad: true,
    sortCriteria: {
      field: "LoadNumber",
      direction: "ascending",
    },
  });

  var config = {
    method: "post",
    url: "http://localhost:8080/shipments",
    data: data,
  };

  useEffect(() => {
    axios(config)
      .then(function (response) {
        console.log(JSON.stringify(response.data));
      })
      .catch(function (error) {
        console.log(error);
      });
  }, []);

  const tableConfig = {
    rowCellPadding: "inherit",
    emptyMessage: "No Owner Operator Found",
    onRowClick: ({ loadNumber }) => `${path}/${loadNumber}`,
    columns: [
      {
        id: "loadNumber",
        label: "Load Number",
        renderer: ({ row }) => {
          return <Fragment>{row.loadNumber}</Fragment>;
        },
      },
      {
        id: "country",
        label: "Pickup Country/State",
        renderer: ({ row }) => {
          return (
            <Fragment>
              {row.origin.county}, {row.origin.stateCode}
            </Fragment>
          );
        },
      },
      {
        id: "pickupDate",
        label: "Pickup By",
        renderer: ({ row }) => {
          const date = new Date(row.pickUpByDate).toDateString();
          return <Fragment>{date}</Fragment>;
        },
      },
      {
        id: "dropCountry",
        label: "Drop Country/State",
        renderer: ({ row }) => {
          return (
            <Fragment>
              {row.destination.county}, {row.destination.stateCode}
            </Fragment>
          );
        },
      },
      {
        id: "dropDate",
        label: "Deliver By",
        renderer: ({ row }) => {
          const date = new Date(row.deliverBy).toDateString();
          return <Fragment>{date}</Fragment>;
        },
      },

      {
        id: "Bidding",
        renderer: ({ row }) => {
          return (
            <Fragment>
              <Button
                variant="outlined"
                color="success"
                onClick={(e) => {
                  e.stopPropagation();
                  history.push(`/${row.loadNumber}/bid`);
                }}
              >
                Bid
              </Button>
            </Fragment>
          );
        },
      },
    ],
  };

  return (
    <div>
      <EnhancedTable
        config={tableConfig}
        data={testData.results}
        loading={false}
      />
      <Route path={path + "/:loadNumber"} component={OwnerOpDetails} />
      <Route path={path + "/:loadNumber/bid"} component={OwnerOpBid} />
    </div>
  );
};

export default OwnerOperator;
