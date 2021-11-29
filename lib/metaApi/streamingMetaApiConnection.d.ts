import MetaApiWebsocketClient from "../clients/metaApi/metaApiWebsocket.client";
import MetatraderAccount from "./metatraderAccount";
import HistoryStorage from "./historyStorage";
import ConnectionRegistry from "./connectionRegistry";
import { RefreshSubscriptionsOpts } from "./metaApi";
import { MarketDataSubscription, MarketDataUnsubscription } from "../clients/metaApi/metaApiWebsocket.client";
import TerminalState from "./terminalState";
import ConnectionHealthMonitor from "./connectionHealthMonitor";
import MetaApiConnection from "./metaApiConnection";
import SynchronizationListener from "../clients/metaApi/synchronizationListener";

/**
 * Exposes MetaApi MetaTrader streaming API connection to consumers
 */
export default class StreamingMetaApiConnection extends MetaApiConnection {
  
  /**
   * Constructs MetaApi MetaTrader streaming Api connection
   * @param {MetaApiWebsocketClient} websocketClient MetaApi websocket client
   * @param {MetatraderAccount} account MetaTrader account id to connect to
   * @param {HistoryStorage} historyStorage terminal history storage. By default an instance of MemoryHistoryStorage
   * will be used.
   * @param {ConnectionRegistry} connectionRegistry metatrader account connection registry
   * @param {Date} [historyStartTime] history start sync time
   * @param {RefreshSubscriptionsOpts} [refreshSubscriptionsOpts] subscriptions refresh options
   */
  constructor(websocketClient: MetaApiWebsocketClient, account: MetatraderAccount, historyStorage: HistoryStorage, connectionRegistry: ConnectionRegistry, historyStartTime?: Date,
    refreshSubscriptionsOpts?: RefreshSubscriptionsOpts);
  
  /**
   * Opens the connection. Can only be called the first time, next calls will be ignored.
   * @return {Promise} promise resolving when the connection is opened
   */
  connect(): Promise<any>;
  
  /**
   * Clears the order and transaction history of a specified application so that it can be synchronized from scratch
   * (see https://metaapi.cloud/docs/client/websocket/api/removeHistory/).
   * @param {String} [application] application to remove history for
   * @return {Promise} promise resolving when the history is cleared
   */
  removeHistory(application?: String): Promise<any>;
  
  /**
   * Clears the order and transaction history of a specified application and removes application (see
   * https://metaapi.cloud/docs/client/websocket/api/removeApplication/).
   * @return {Promise} promise resolving when the history is cleared and application is removed
   */
  removeApplication(): Promise<any>;
  
  /**
   * Requests the terminal to start synchronization process
   * (see https://metaapi.cloud/docs/client/websocket/synchronizing/synchronize/)
   * @param {String} instanceIndex instance index
   * @returns {Promise} promise which resolves when synchronization started
   */
  synchronize(instanceIndex: String): Promise<any>;
  
  /**
   * Initializes meta api connection
   * @return {Promise} promise which resolves when meta api connection is initialized
   */
  initialize(): Promise<any>;
  
  /**
   * Initiates subscription to MetaTrader terminal
   * @returns {Promise} promise which resolves when subscription is initiated
   */
  subscribe(): Promise<any>;
  
  /**
   * Subscribes on market data of specified symbol (see
   * https://metaapi.cloud/docs/client/websocket/marketDataStreaming/subscribeToMarketData/).
   * @param {String} symbol symbol (e.g. currency pair or an index)
   * @param {Array<MarketDataSubscription>} subscriptions array of market data subscription to create or update. Please
   * note that this feature is not fully implemented on server-side yet
   * @param {Number} instanceIndex instance index
   * @param {number} [timeoutInSeconds] timeout to wait for prices in seconds, default is 30
   * @returns {Promise} promise which resolves when subscription request was processed
   */
  subscribeToMarketData(symbol: String, subscriptions: Array<MarketDataSubscription>, instanceIndex: Number, timeoutInSeconds: Number): Promise<any>;
  
  /**
   * Unsubscribes from market data of specified symbol (see
   * https://metaapi.cloud/docs/client/websocket/marketDataStreaming/unsubscribeFromMarketData/).
   * @param {String} symbol symbol (e.g. currency pair or an index)
   * @param {Array<MarketDataUnsubscription>} subscriptions array of subscriptions to cancel
   * @param {Number} instanceIndex instance index
   * @returns {Promise} promise which resolves when unsubscription request was processed
   */
  unsubscribeFromMarketData(symbol: String, subscriptions: MarketDataUnsubscription, instanceIndex: Number): Promise<any>;
  
  /**
   * Invoked when subscription downgrade has occurred
   * @param {String} instanceIndex index of an account instance connected
   * @param {String} symbol symbol to update subscriptions for
   * @param {Array<MarketDataSubscription>} updates array of market data subscription to update
   * @param {Array<MarketDataUnsubscription>} unsubscriptions array of subscriptions to cancel
   * @return {Promise} promise which resolves when the asynchronous event is processed
   */
  onSubscriptionDowngraded(instanceIndex: String, symbol: String, updates: Array<MarketDataSubscription>, unsubscriptions: Array<MarketDataUnsubscription>): Promise<any>;
  
  /**
   * Returns list of the symbols connection is subscribed to
   * @returns {Array<String>} list of the symbols connection is subscribed to
   */
  get subscribedSymbols(): Array<String>;
  
  /**
   * Returns subscriptions for a symbol
   * @param {String} symbol symbol to retrieve subscriptions for
   * @returns {Array<MarketDataSubscription>} list of market data subscriptions for the symbol
   */
  subscriptions(symbol: String): Array<MarketDataSubscription>;
  
  /**
   * Sends client uptime stats to the server.
   * @param {Object} uptime uptime statistics to send to the server
   * @returns {Promise} promise which resolves when uptime statistics is submitted
   */
  saveUptime(uptime: Object): Promise<any>;
  
  /**
   * Returns local copy of terminal state
   * @returns {TerminalState} local copy of terminal state
   */
  get terminalState(): TerminalState;
  
  /**
   * Returns local history storage
   * @returns {HistoryStorage} local history storage
   */
  get historyStorage(): HistoryStorage;
  
  /**
   * Adds synchronization listener
   * @param {SynchronizationListener} listener synchronization listener to add
   */
  addSynchronizationListener(listener: SynchronizationListener): void;
  
  /**
   * Removes synchronization listener for specific account
   * @param {SynchronizationListener} listener synchronization listener to remove
   */
  removeSynchronizationListener(listener: SynchronizationListener): void;
  
  /**
   * Invoked when connection to MetaTrader terminal established
   * @param {String} instanceIndex index of an account instance connected
   * @param {Number} replicas number of account replicas launched
   * @return {Promise} promise which resolves when the asynchronous event is processed
   */
  onConnected(instanceIndex: String, replicas: Number): Promise<any>;
  
  /**
   * Invoked when connection to MetaTrader terminal terminated
   * @param {String} instanceIndex index of an account instance connected
   */
  onDisconnected(instanceIndex: String): Promise<any>;
  
  /**
   * Invoked when a synchronization of history deals on a MetaTrader account have finished to indicate progress of an
   * initial terminal state synchronization
   * @param {String} instanceIndex index of an account instance connected
   * @param {String} synchronizationId synchronization request id
   * @return {Promise} promise which resolves when the asynchronous event is processed
   */
  onDealsSynchronized(instanceIndex: String, synchronizationId: String): Promise<any>;
  
  /**
   * Invoked when a synchronization of history orders on a MetaTrader account have finished to indicate progress of an
   * initial terminal state synchronization
   * @param {String} instanceIndex index of an account instance connected
   * @param {String} synchronizationId synchronization request id
   * @return {Promise} promise which resolves when the asynchronous event is processed
   */
  onHistoryOrdersSynchronized(instanceIndex: String, synchronizationId: String): Promise<any>;
  
  /**
   * Invoked when connection to MetaApi websocket API restored after a disconnect
   * @return {Promise} promise which resolves when connection to MetaApi websocket API restored after a disconnect
   */
  onReconnected(): Promise<any>;
  
  /**
   * Invoked when a stream for an instance index is closed
   * @param {String} instanceIndex index of an account instance connected
   * @return {Promise} promise which resolves when the asynchronous event is processed
   */
  onStreamClosed(instanceIndex: String): Promise<any>;
  
  /**
   * Invoked when MetaTrader terminal state synchronization is started
   * @param {String} instanceIndex index of an account instance connected
   * @param {Boolean} specificationsUpdated whether specifications are going to be updated during synchronization
   * @param {Boolean} positionsUpdated whether positions are going to be updated during synchronization
   * @param {Boolean} ordersUpdated whether orders are going to be updated during synchronization
   * @return {Promise} promise which resolves when the asynchronous event is processed
   */
  onSynchronizationStarted(instanceIndex: String, specificationsUpdated: Boolean, positionsUpdated: Boolean, ordersUpdated: Boolean): Promise<any>;
  
  /**
   * Returns flag indicating status of state synchronization with MetaTrader terminal
   * @param {String} instanceIndex index of an account instance connected
   * @param {String} synchronizationId optional synchronization request id, last synchronization request id will be used
   * by default
   * @return {Promise<Boolean>} promise resolving with a flag indicating status of state synchronization with MetaTrader
   * terminal
   */
  isSynchronized(instanceIndex: String, synchronizationId: String): Promise<Boolean>;
  
  /**
   * Waits until synchronization to MetaTrader terminal is completed
   * @param {SynchronizationOptions} synchronization options
   * @return {Promise} promise which resolves when synchronization to MetaTrader terminal is completed
   */
  waitSynchronized(opts: SynchronizationOptions): Promise<any>;
  
  /**
   * Closes the connection. The instance of the class should no longer be used after this method is invoked.
   */
  close(): Promise<void>;
  
  /**
   * Returns synchronization status
   * @return {boolean} synchronization status
   */
  get synchronized(): Boolean;
  
  /**
   * Returns MetaApi account
   * @return {MetatraderAccount} MetaApi account
   */
  get account(): MetatraderAccount;
  
  /**
   * Returns connection health monitor instance
   * @return {ConnectionHealthMonitor} connection health monitor instance
   */
  get healthMonitor(): ConnectionHealthMonitor;
}

/**
 * Synchronization options
 */
declare type SynchronizationOptions = {

  /**
   * application regular expression pattern, default is .*
   */
  applicationPattern?: String,

  /**
   * synchronization id, last synchronization request id will be used by
   * default
   */
  synchronizationId?: String,

  /**
   * index of an account instance to ensure synchronization on, default is to wait
   * for the first instance to synchronize
   */
  instanceIndex?: Number,

  /**
   * wait timeout in seconds, default is 5m
   */
  timeoutInSeconds?: Number,

  /**
   * interval between account reloads while waiting for a change, default is 1s
   */
  intervalInMilliseconds?: Number
}
