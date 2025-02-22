'use strict';

import SynchronizationListener from '../clients/metaApi/synchronizationListener';
import LoggerManager from '../logger';

/**
 * Exposes MetaApi MetaTrader API connection to consumers
 */
export default class MetaApiConnection extends SynchronizationListener {

  /**
   * Constructs MetaApi MetaTrader Api connection
   * @param {MetaApiWebsocketClient} websocketClient MetaApi websocket client
   * @param {MetatraderAccount} account MetaTrader account id to connect to
   * @param {String} [application] application to use
   */
  constructor(websocketClient, account, application) {
    super();
    this._websocketClient = websocketClient;
    this._account = account;
    this._logger = LoggerManager.getLogger('MetaApiConnection');
    this._application = application;
  }

  /**
   * Common trade options
   * @typedef {Object} TradeOptions
   * @property {String} [comment] optional order comment. The sum of the line lengths of the comment and the
   * clientId must be less than or equal to 26. For more information see
   * https://metaapi.cloud/docs/client/clientIdUsage/
   * @property {String} [clientId] optional client-assigned id. The id value can be assigned when submitting a trade and
   * will be present on position, history orders and history deals related to the trade. You can use this field to bind
   * your trades to objects in your application and then track trade progress. The sum of the line lengths of the
   * comment and the clientId must be less than or equal to 26. For more information see
   * https://metaapi.cloud/docs/client/clientIdUsage/
   * @property {Number} [magic] optional magic (expert id) number. If not set default value specified in account entity
   * will be used.
   * @property {Number} [slippage] optional slippage in points. Should be greater or equal to zero. In not set,
   * default value specified in account entity will be used. Slippage is ignored if execution mode set to
   * SYMBOL_TRADE_EXECUTION_MARKET in symbol specification. Not used for close by orders.
   */

  /**
   * Market trade options
   * @typedef {TradeOptions} MarketTradeOptions
   * @property {Array<String>} [fillingModes] optional allowed filling modes in the order of priority. Default is to
   * allow all filling modes and prefer ORDER_FILLING_FOK over ORDER_FILLING_IOC. See
   * https://www.mql5.com/en/docs/constants/tradingconstants/orderproperties#enum_order_type_filling for extra
   * explanation
   */

  /**
   * Pending order trade options
   * @typedef {TradeOptions} PendingTradeOptions
   * @property {ExpirationOptions} [expiration] optional pending order expiration settings. See Pending order expiration
   * settings section
   */

  /**
   * Pending order expiration settings
   * @typedef {Object} ExpirationOptions
   * @property {String} type pending order expiration type. See
   * https://www.mql5.com/en/docs/constants/tradingconstants/orderproperties#enum_order_type_time for the list of
   * possible options. MetaTrader4 platform supports only ORDER_TIME_SPECIFIED expiration type. One of ORDER_TIME_GTC,
   * ORDER_TIME_DAY, ORDER_TIME_SPECIFIED, ORDER_TIME_SPECIFIED_DAY
   * @property {Date} [time] optional pending order expiration time. Ignored if expiration type is not one of
   * ORDER_TIME_DAY or ORDER_TIME_SPECIFIED
   */

  /**
   * Stop options
   * @typedef {Object} StopOptions
   * @property {number} value stop (SL or TP) value
   * @property {string} units stop units. ABSOLUTE_PRICE means the that the value of value field is a final stop value.
   * RELATIVE_* means that the value field value contains relative stop expressed either in price, points, account
   * currency or balance percentage. Default is ABSOLUTE_PRICE. Allowed values are ABSOLUTE_PRICE, RELATIVE_PRICE,
   * RELATIVE_POINTS, RELATIVE_CURRENCY, RELATIVE_BALANCE_PERCENTAGE
   */

  /**
   * Creates a market buy order (see https://metaapi.cloud/docs/client/websocket/api/trade/).
   * @param {string} symbol symbol to trade
   * @param {number} volume order volume
   * @param {number|StopOptions} [stopLoss] stop loss price
   * @param {number|StopOptions} [takeProfit] take profit price
   * @param {MarketTradeOptions} options optional trade options
   * @returns {Promise<TradeResponse>} promise resolving with trade result
   * @throws {TradeError} on trade error, check error properties for error code details
   */
  createMarketBuyOrder(symbol, volume, stopLoss, takeProfit, options = {}) {
    return this._websocketClient.trade(this._account.id, Object.assign({actionType: 'ORDER_TYPE_BUY', symbol, volume},
      this._generateStopOptions(stopLoss, takeProfit), options || {}), this._application);
  }

  /**
   * Creates a market sell order (see https://metaapi.cloud/docs/client/websocket/api/trade/).
   * @param {string} symbol symbol to trade
   * @param {number} volume order volume
   * @param {number|StopOptions} [stopLoss] stop loss price
   * @param {number|StopOptions} [takeProfit] take profit price
   * @param {MarketTradeOptions} options optional trade options
   * @returns {Promise<TradeResponse>} promise resolving with trade result
   * @throws {TradeError} on trade error, check error properties for error code details
   */
  createMarketSellOrder(symbol, volume, stopLoss, takeProfit, options = {}) {
    return this._websocketClient.trade(this._account.id, Object.assign({actionType: 'ORDER_TYPE_SELL', symbol, volume},
      this._generateStopOptions(stopLoss, takeProfit), options || {}), this._application);
  }

  /**
   * Creates a limit buy order (see https://metaapi.cloud/docs/client/websocket/api/trade/).
   * @param {String} symbol symbol to trade
   * @param {number} volume order volume
   * @param {number} openPrice order limit price
   * @param {number|StopOptions} [stopLoss] stop loss price
   * @param {number|StopOptions} [takeProfit] take profit price
   * @param {PendingTradeOptions} options optional trade options
   * @returns {Promise<TradeResponse>} promise resolving with trade result
   * @throws {TradeError} on trade error, check error properties for error code details
   */
  createLimitBuyOrder(symbol, volume, openPrice, stopLoss, takeProfit, options = {}) {
    return this._websocketClient.trade(this._account.id, Object.assign({actionType: 'ORDER_TYPE_BUY_LIMIT', symbol,
      volume, openPrice}, this._generateStopOptions(stopLoss, takeProfit), options || {}), this._application);
  }

  /**
   * Creates a limit sell order (see https://metaapi.cloud/docs/client/websocket/api/trade/).
   * @param {string} symbol symbol to trade
   * @param {number} volume order volume
   * @param {number} openPrice order limit price
   * @param {number|StopOptions} [stopLoss] stop loss price
   * @param {number|StopOptions} [takeProfit] take profit price
   * @param {PendingTradeOptions} options optional trade options
   * @returns {Promise<TradeResponse>} promise resolving with trade result
   * @throws {TradeError} on trade error, check error properties for error code details
   */
  createLimitSellOrder(symbol, volume, openPrice, stopLoss, takeProfit, options = {}) {
    return this._websocketClient.trade(this._account.id, Object.assign({actionType: 'ORDER_TYPE_SELL_LIMIT', symbol,
      volume, openPrice}, this._generateStopOptions(stopLoss, takeProfit), options || {}), this._application);
  }

  /**
   * Creates a stop buy order (see https://metaapi.cloud/docs/client/websocket/api/trade/).
   * @param {string} symbol symbol to trade
   * @param {number} volume order volume
   * @param {number} openPrice order stop price
   * @param {number|StopOptions} [stopLoss] stop loss price
   * @param {number|StopOptions} [takeProfit] take profit price
   * @param {PendingTradeOptions} options optional trade options
   * @returns {Promise<TradeResponse>} promise resolving with trade result
   * @throws {TradeError} on trade error, check error properties for error code details
   */
  createStopBuyOrder(symbol, volume, openPrice, stopLoss, takeProfit, options = {}) {
    return this._websocketClient.trade(this._account.id, Object.assign({actionType: 'ORDER_TYPE_BUY_STOP', symbol,
      volume, openPrice}, this._generateStopOptions(stopLoss, takeProfit), options || {}), this._application);
  }

  /**
   * Creates a stop sell order (see https://metaapi.cloud/docs/client/websocket/api/trade/).
   * @param {string} symbol symbol to trade
   * @param {number} volume order volume
   * @param {number} openPrice order stop price
   * @param {number|StopOptions} [stopLoss] stop loss price
   * @param {number|StopOptions} [takeProfit] take profit price
   * @param {PendingTradeOptions} options optional trade options
   * @returns {Promise<TradeResponse>} promise resolving with trade result
   * @throws {TradeError} on trade error, check error properties for error code details
   */
  createStopSellOrder(symbol, volume, openPrice, stopLoss, takeProfit, options = {}) {
    return this._websocketClient.trade(this._account.id, Object.assign({actionType: 'ORDER_TYPE_SELL_STOP', symbol,
      volume, openPrice}, this._generateStopOptions(stopLoss, takeProfit), options || {}), this._application);
  }

  /**
   * Creates a stop limit buy order (see https://metaapi.cloud/docs/client/websocket/api/trade/).
   * @param {string} symbol symbol to trade
   * @param {number} volume order volume
   * @param {number} openPrice order stop price
   * @param {number} stopLimitPrice the limit order price for the stop limit order
   * @param {number|StopOptions} [stopLoss] stop loss price
   * @param {number|StopOptions} [takeProfit] take profit price
   * @param {PendingTradeOptions} options optional trade options
   * @returns {Promise<TradeResponse>} promise resolving with trade result
   * @throws {TradeError} on trade error, check error properties for error code details
   */
  createStopLimitBuyOrder(symbol, volume, openPrice, stopLimitPrice, stopLoss, takeProfit, options = {}) {
    return this._websocketClient.trade(this._account.id, Object.assign({actionType: 'ORDER_TYPE_BUY_STOP_LIMIT',
      symbol, volume, openPrice, stopLimitPrice}, this._generateStopOptions(stopLoss, takeProfit), options || {}),
    this._application);
  }

  /**
   * Creates a stop limit sell order (see https://metaapi.cloud/docs/client/websocket/api/trade/).
   * @param {string} symbol symbol to trade
   * @param {number} volume order volume
   * @param {number} openPrice order stop price
   * @param {number} stopLimitPrice the limit order price for the stop limit order
   * @param {number|StopOptions} [stopLoss] stop loss price
   * @param {number|StopOptions} [takeProfit] take profit price
   * @param {PendingTradeOptions} options optional trade options
   * @returns {Promise<TradeResponse>} promise resolving with trade result
   * @throws {TradeError} on trade error, check error properties for error code details
   */
  createStopLimitSellOrder(symbol, volume, openPrice, stopLimitPrice, stopLoss, takeProfit, options = {}) {
    return this._websocketClient.trade(this._account.id, Object.assign({actionType: 'ORDER_TYPE_SELL_STOP_LIMIT',
      symbol, volume, openPrice, stopLimitPrice}, this._generateStopOptions(stopLoss, takeProfit), options || {}),
    this._application);
  }

  /**
   * Modifies a position (see https://metaapi.cloud/docs/client/websocket/api/trade/).
   * @param {string} positionId position id to modify
   * @param {number|StopOptions} [stopLoss] stop loss price
   * @param {number|StopOptions} [takeProfit] take profit price
   * @returns {Promise<TradeResponse>} promise resolving with trade result
   * @throws {TradeError} on trade error, check error properties for error code details
   */
  modifyPosition(positionId, stopLoss, takeProfit) {
    return this._websocketClient.trade(this._account.id, Object.assign({actionType: 'POSITION_MODIFY', positionId},
      this._generateStopOptions(stopLoss, takeProfit)), this._application);
  }

  /**
   * Partially closes a position (see https://metaapi.cloud/docs/client/websocket/api/trade/).
   * @param {string} positionId position id to modify
   * @param {number} volume volume to close
   * @param {MarketTradeOptions} options optional trade options
   * @returns {Promise<TradeResponse>} promise resolving with trade result
   * @throws {TradeError} on trade error, check error properties for error code details
   */
  closePositionPartially(positionId, volume, options = {}) {
    return this._websocketClient.trade(this._account.id, Object.assign({actionType: 'POSITION_PARTIAL', positionId,
      volume}, options || {}), this._application);
  }

  /**
   * Fully closes a position (see https://metaapi.cloud/docs/client/websocket/api/trade/).
   * @param {string} positionId position id to modify
   * @param {MarketTradeOptions} options optional trade options
   * @returns {Promise<TradeResponse>} promise resolving with trade result
   * @throws {TradeError} on trade error, check error properties for error code details
   */
  closePosition(positionId, options = {}) {
    return this._websocketClient.trade(this._account.id, Object.assign({actionType: 'POSITION_CLOSE_ID', positionId},
      options || {}), this._application);
  }

  /**
   * Fully closes a position (see https://metaapi.cloud/docs/client/websocket/api/trade/).
   * @param {string} positionId position id to close by opposite position
   * @param {string} oppositePositionId opposite position id to close
   * @param {MarketTradeOptions} options optional trade options
   * @returns {Promise<TradeResponse>} promise resolving with trade result
   * @throws {TradeError} on trade error, check error properties for error code details
   */
  closeBy(positionId, oppositePositionId, options = {}) {
    return this._websocketClient.trade(this._account.id, Object.assign({actionType: 'POSITION_CLOSE_BY', positionId,
      closeByPositionId: oppositePositionId}, options || {}), this._application);
  }

  /**
   * Closes positions by a symbol(see https://metaapi.cloud/docs/client/websocket/api/trade/).
   * @param {string} symbol symbol to trade
   * @param {MarketTradeOptions} options optional trade options
   * @returns {Promise<TradeResponse>} promise resolving with trade result
   * @throws {TradeError} on trade error, check error properties for error code details
   */
  closePositionsBySymbol(symbol, options = {}) {
    return this._websocketClient.trade(this._account.id, Object.assign({actionType: 'POSITIONS_CLOSE_SYMBOL', symbol},
      options || {}), this._application);
  }

  /**
   * Modifies a pending order (see https://metaapi.cloud/docs/client/websocket/api/trade/).
   * @param {string} orderId order id (ticket number)
   * @param {number} openPrice order stop price
   * @param {number|StopOptions} [stopLoss] stop loss price
   * @param {number|StopOptions} [takeProfit] take profit price
   * @returns {Promise<TradeResponse>} promise resolving with trade result
   * @throws {TradeError} on trade error, check error properties for error code details
   */
  modifyOrder(orderId, openPrice, stopLoss, takeProfit) {
    return this._websocketClient.trade(this._account.id, Object.assign({actionType: 'ORDER_MODIFY', orderId, openPrice},
      this._generateStopOptions(stopLoss, takeProfit)), this._application);
  }

  /**
   * Cancels order (see https://metaapi.cloud/docs/client/websocket/api/trade/).
   * @param {string} orderId order id (ticket number)
   * @returns {Promise<TradeResponse>} promise resolving with trade result
   * @throws {TradeError} on trade error, check error properties for error code details
   */
  cancelOrder(orderId) {
    return this._websocketClient.trade(this._account.id, {actionType: 'ORDER_CANCEL', orderId}, this._application);
  }

  /**
   * Reconnects to the Metatrader terminal (see https://metaapi.cloud/docs/client/websocket/api/reconnect/).
   * @returns {Promise} promise which resolves when reconnection started
   */
  reconnect() {
    return this._websocketClient.reconnect(this._account.id);
  }


  /**
   * Returns MetaApi account
   * @return {MetatraderAccount} MetaApi account
   */
  get account() {
    return this._account;
  }
  _generateStopOptions(stopLoss, takeProfit) {
    let trade = {};
    if (typeof stopLoss === 'number') {
      trade.stopLoss = stopLoss;
    } else if (stopLoss) {
      trade.stopLoss = stopLoss.value;
      trade.stopLossUnits = stopLoss.units;
    }
    if (typeof takeProfit === 'number') {
      trade.takeProfit = takeProfit;
    } else if (takeProfit) {
      trade.takeProfit = takeProfit.value;
      trade.takeProfitUnits = takeProfit.units;
    }
    return trade;
  }

  async _ensureSynchronized(instanceIndex, key) {
    let state = this._getState(instanceIndex);
    if (state && !this._closed) {
      try {
        const synchronizationResult = await this.synchronize(instanceIndex);
        if(synchronizationResult) {
          state.synchronized = true;
          state.synchronizationRetryIntervalInSeconds = 1;
        }
      } catch (err) {
        this._logger.error('MetaApi websocket client for account ' + this._account.id +
          ':' + instanceIndex + ' failed to synchronize', err);
        if (state.shouldSynchronize === key) {
          setTimeout(this._ensureSynchronized.bind(this, instanceIndex, key),
            state.synchronizationRetryIntervalInSeconds * 1000);
          state.synchronizationRetryIntervalInSeconds = Math.min(state.synchronizationRetryIntervalInSeconds * 2, 300);
        }
      }
    }
  }

  _getState(instanceIndex) {
    if (!this._stateByInstanceIndex['' + instanceIndex]) {
      this._stateByInstanceIndex['' + instanceIndex] = {
        instanceIndex,
        ordersSynchronized: {},
        dealsSynchronized: {},
        shouldSynchronize: undefined,
        synchronizationRetryIntervalInSeconds: 1,
        synchronized: false,
        lastDisconnectedSynchronizationId: undefined,
        lastSynchronizationId: undefined,
        disconnected: false
      };
    }
    return this._stateByInstanceIndex['' + instanceIndex];
  }

}
