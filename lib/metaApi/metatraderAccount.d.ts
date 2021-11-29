import MetatraderAccountClient, { Extension } from "../clients/metaApi/metatraderAccount.client";
import { MetatraderAccountDto } from "../clients/metaApi/metatraderAccount.client";
import MetaApiWebsocketClient, { MetatraderTick } from "../clients/metaApi/metaApiWebsocket.client";
import ConnectionRegistry from "./connectionRegistry";
import ExpertAdvisorClient, { NewExpertAdvisorDto } from "../clients/metaApi/expertAdvisor.client";
import HistoricalMarketDataClient from "../clients/metaApi/historicalMarketData.client";
import HistoryStorage from "./historyStorage";
import RpcMetaApiConnection from "./rpcMetaApiConnection";
import ExpertAdvisor from "./expertAdvisor";
import StreamingMetaApiConnection from "./streamingMetaApiConnection";
import MetatraderCandle from "../clients/metaApi/metaApiWebsocket.client";


/**
 * Implements a MetaTrader account entity
 */
export default class MetatraderAccount {
  
  /**
   * Constructs a MetaTrader account entity
   * @param {MetatraderAccountDto} data MetaTrader account data
   * @param {MetatraderAccountClient} metatraderAccountClient MetaTrader account REST API client
   * @param {MetaApiWebsocketClient} metaApiWebsocketClient MetaApi websocket client
   * @param {ConnectionRegistry} connectionRegistry metatrader account connection registry
   * @param {ExpertAdvisorClient} expertAdvisorClient expert advisor REST API client
   * @param {HistoricalMarketDataClient} historicalMarketDataClient historical market data HTTP API client
   */
  constructor(data: MetatraderAccountDto, metatraderAccountClient: MetatraderAccountClient, metaApiWebsocketClient: MetaApiWebsocketClient, connectionRegistry: ConnectionRegistry, expertAdvisorClient: ExpertAdvisorClient, 
    historicalMarketDataClient: HistoricalMarketDataClient);
  
  /**
   * Returns account id
   * @return {String} account id
   */
  get id(): String;
  
  /**
   * Returns account name
   * @return {String} account name
   */
  get name(): String;
  
  /**
   * Returns account type. Possible values are cloud, cloud-g1, cloud-g2 and self-hosted.
   * @return {String} account type
   */
  get type(): String;
  
  /**
   * Returns account login
   * @return {String} account login
   */
  get login(): String;
  
  /**
   * Returns MetaTrader server which hosts the account
   * @return {String} MetaTrader server which hosts the account
   */
  get server(): String;
  
  /**
   * Returns id of the account's provisioning profile
   * @return {String} id of the account's provisioning profile
   */
  get provisioningProfileId(): String;
  
  /**
   * Returns application name to connect the account to. Currently allowed values are MetaApi and AgiliumTrade
   * @return {String} application name to connect the account to
   */
  get application(): String;
  
  /**
   * Returns MetaTrader magic to place trades using
   * @return {Number} MetaTrader magic to place trades using
   */
  get magic(): Number;
  
  /**
   * Returns account deployment state. One of CREATED, DEPLOYING, DEPLOYED, UNDEPLOYING, UNDEPLOYED, DELETING
   * @return {String} account deployment state
   */
  get state(): String;
  
  /**
   * Returns terminal & broker connection status, one of CONNECTED, DISCONNECTED, DISCONNECTED_FROM_BROKER
   * @return {String} terminal & broker connection status
   */
  get connectionStatus(): String;
  
  /**
   * Returns authorization access token to be used for accessing single account data.
   * Intended to be used in browser API.
   * @return {String} authorization token
   */
  get accessToken(): String;
  
  /**
   * Returns flag indicating if trades should be placed as manual trades on this account
   * @return {Boolean} flag indicating if trades should be placed as manual trades on this account
   */
  get manualTrades(): Boolean;
  
  /**
   * Returns API extensions
   * @return {Array<Extension>} API extensions
   */
  get extensions(): Array<Extension>;
  
  /**
   * Returns extra information which can be stored together with your account
   * @return {Object} extra information which can be stored together with your account
   */
  get metadata(): Object;
  
  /**
   * Returns user-defined account tags
   * @return {Array<String>} user-defined account tags
   */
  get tags(): Array<String>;
  
  /**
   * Returns account roles for CopyFactory2 application
   * @return {Array<String>} account roles for CopyFactory2 application
   */
  get copyFactoryRoles(): Array<String>;
  
  /**
   * Returns number of resource slots to allocate to account. Allocating extra resource slots
   * results in better account performance under load which is useful for some applications. E.g. if you have many
   * accounts copying the same strategy via CooyFactory API, then you can increase resourceSlots to get a lower trade
   * copying latency. Please note that allocating extra resource slots is a paid option. Please note that high
   * reliability accounts use redundant infrastructure, so that each resource slot for a high reliability account
   * is billed as 2 standard resource slots.  Default is 1.
   * @return {number} number of resource slots to allocate to account
   */
  get resourceSlots(): Number;
  
  /**
   * Returns the number of CopyFactory 2 resource slots to allocate to account.
   * Allocating extra resource slots results in lower trade copying latency. Please note that allocating extra resource
   * slots is a paid option. Please also note that CopyFactory 2 uses redundant infrastructure so that
   * each CopyFactory resource slot is billed as 2 standard resource slots. You will be billed for CopyFactory 2
   * resource slots only if you have added your account to CopyFactory 2 by specifying copyFactoryRoles field.
   * Default is 1.
   * @return {number} number of CopyFactory 2 resource slots to allocate to account
   */
  get copyFactoryResourceSlots(): Number;
  
  /**
   * Returns 3-character ISO currency code of the account base currency. Default value is USD. The setting is to be used
   * for copy trading accounts which use national currencies only, such as some Brazilian brokers. You should not alter
   * this setting unless you understand what you are doing.
   * @return {number} 3-character ISO currency code of the account base currency
   */
  get baseCurrency(): Number;
  
  /**
   * Returns reliability value. Possible values are regular and high
   * @return {String} account reliability value
   */
  get reliability(): String;
  
  /**
   * Returns version value. Possible values are 4 and 5
   * @return {String} account version value
   */
  get version(): String;
  
  /**
   * Reloads MetaTrader account from API
   * @return {Promise} promise resolving when MetaTrader account is updated
   */
  reload(): Promise<any>;
  
  /**
   * Removes MetaTrader account. Cloud account transitions to DELETING state. 
   * It takes some time for an account to be eventually deleted. Self-hosted 
   * account is deleted immediately.
   * @return {Promise} promise resolving when account is scheduled for deletion
   */
  remove(): Promise<any>;
  
  /**
   * Schedules account for deployment. It takes some time for API server to be started and account to reach the DEPLOYED
   * state
   * @returns {Promise} promise resolving when account is scheduled for deployment
   */
  deploy(): Promise<any>;
  
  /**
   * Schedules account for undeployment. It takes some time for API server to be stopped and account to reach the
   * UNDEPLOYED state
   * @returns {Promise} promise resolving when account is scheduled for undeployment
   */
  undeploy(): Promise<any>;
  
  /**
   * Schedules account for redeployment. It takes some time for API server to be restarted and account to reach the
   * DEPLOYED state
   * @returns {Promise} promise resolving when account is scheduled for redeployment
   */
  redeploy(): Promise<any>;
  
  /**
   * Increases MetaTrader account reliability. The account will be temporary stopped to perform this action
   * @returns {Promise} promise resolving when account reliability is increased
   */
  increaseReliability(): Promise<any>;
  
  /**
   * Waits until API server has finished deployment and account reached the DEPLOYED state
   * @param {Number} timeoutInSeconds wait timeout in seconds, default is 5m
   * @param {Number} intervalInMilliseconds interval between account reloads while waiting for a change, default is 1s
   * @return {Promise} promise which resolves when account is deployed
   */
  waitDeployed(timeoutInSeconds?: Number, intervalInMilliseconds?: Number): Promise<any>;
  
  /**
   * Waits until API server has finished undeployment and account reached the UNDEPLOYED state
   * @param {Number} timeoutInSeconds wait timeout in seconds, default is 5m
   * @param {Number} intervalInMilliseconds interval between account reloads while waiting for a change, default is 1s
   * @return {Promise} promise which resolves when account is deployed
   */
  waitUndeployed(timeoutInSeconds?: Number, intervalInMilliseconds?: Number): Promise<any>;
  
  /**
   * Waits until account has been deleted
   * @param {Number} timeoutInSeconds wait timeout in seconds, default is 5m
   * @param {Number} intervalInMilliseconds interval between account reloads while waiting for a change, default is 1s
   * @return {Promise} promise which resolves when account is deleted
   */
  waitRemoved(timeoutInSeconds?: Number, intervalInMilliseconds?: Number): Promise<any>;
  
  /**
   * Waits until API server has connected to the terminal and terminal has connected to the broker
   * @param {Number} timeoutInSeconds wait timeout in seconds, default is 5m
   * @param {Number} intervalInMilliseconds interval between account reloads while waiting for a change, default is 1s
   * @return {Promise} promise which resolves when API server is connected to the broker
   */
  waitConnected(timeoutInSeconds?: Number, intervalInMilliseconds?: Number): Promise<any>;
  
  /**
   * Connects to MetaApi. There is only one connection per account. Subsequent calls to this method will return the same connection.
   * @param {HistoryStorage} historyStorage optional history storage
   * @param {Date} [historyStartTime] history start time. Used for tests
   * @return {StreamingMetaApiConnection} MetaApi connection
   */
  getStreamingConnection(historyStorage?: HistoryStorage, historyStartTime?: Date): StreamingMetaApiConnection;
  
  /**
   * Connects to MetaApi via RPC connection.
   * @returns {RpcMetaApiConnection} MetaApi connection
   */
  getRPCConnection(): RpcMetaApiConnection;
  
  /**
   * Updates MetaTrader account data
   * @param {MetatraderAccountUpdateDto} account MetaTrader account update
   * @return {Promise} promise resolving when account is updated
   */
  update(account: MetatraderAccountDto): Promise<any>;
  
  /**
   * Retrieves expert advisor of current account
   * @returns {Promise<ExpertAdvisor[]>} promise resolving with an array of expert advisor entities
   */
  getExpertAdvisors(): Promise<ExpertAdvisor[]>;
  
  /**
   * Retrieves a expert advisor of current account by id
   * @param {String} expertId expert advisor id
   * @returns {Promise<ExpertAdvisor>} promise resolving with expert advisor entity
   */
  getExpertAdvisor(expertId: String): Promise<ExpertAdvisor>;
  
  /**
   * Creates an expert advisor
   * @param {String} expertId expert advisor id
   * @param {NewExpertAdvisorDto} expert expert advisor data
   * @returns {Promise<ExpertAdvisor>} promise resolving with expert advisor entity
   */
  createExpertAdvisor(expertId: String, expert: NewExpertAdvisorDto): Promise<ExpertAdvisor>;
  
  /**
   * Returns historical candles for a specific symbol and timeframe from the MetaTrader account.
   * See https://metaapi.cloud/docs/client/restApi/api/retrieveMarketData/readHistoricalCandles/
   * @param {string} symbol symbol to retrieve candles for (e.g. a currency pair or an index)
   * @param {string} timeframe defines the timeframe according to which the candles must be generated. Allowed values
   * for MT5 are 1m, 2m, 3m, 4m, 5m, 6m, 10m, 12m, 15m, 20m, 30m, 1h, 2h, 3h, 4h, 6h, 8h, 12h, 1d, 1w, 1mn. Allowed
   * values for MT4 are 1m, 5m, 15m 30m, 1h, 4h, 1d, 1w, 1mn
   * @param {Date} [startTime] time to start loading candles from. Note that candles are loaded in backwards direction, so
   * this should be the latest time. Leave empty to request latest candles.
   * @param {number} [limit] maximum number of candles to retrieve. Must be less or equal to 1000
   * @return {Promise<Array<MetatraderCandle>>} promise resolving with historical candles downloaded
   */
  getHistoricalCandles(symbol: String, timeframe: String, startTime?: Date, limit?: Number): Promise<Array<MetatraderCandle>>;
  
  /**
   * Returns historical ticks for a specific symbol from the MetaTrader account. This API is not supported by MT4
   * accounts.
   * See https://metaapi.cloud/docs/client/restApi/api/retrieveMarketData/readHistoricalTicks/
   * @param {string} symbol symbol to retrieve ticks for (e.g. a currency pair or an index)
   * @param {Date} [startTime] time to start loading ticks from. Note that candles are loaded in forward direction, so
   * this should be the earliest time. Leave empty to request latest candles.
   * @param {number} [offset] number of ticks to skip (you can use it to avoid requesting ticks from previous request
   * twice)
   * @param {number} [limit] maximum number of ticks to retrieve. Must be less or equal to 1000
   * @return {Promise<Array<MetatraderTick>>} promise resolving with historical ticks downloaded
   */
  getHistoricalTicks(symbol: String, startTime?: Date, offset?: Number, limit?: Number): Promise<Array<MetatraderTick>>;
}
