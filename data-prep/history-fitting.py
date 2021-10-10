# https://api.coingecko.com/api/v3/coins/bitcoin/ohlc?vs_currency=usd&days=7
import argparse
import json
from datetime import datetime, timedelta
from pathlib import Path

import matplotlib.pyplot as plt
import numpy as np
import pandas as pd
import requests
from dateutil.relativedelta import *
from pycoingecko import CoinGeckoAPI
from tqdm import tqdm


def get_token_data(token, api_key, end_date, start_date, put_date_info=True):
    params = {
        "format": "csv",
        "key": api_key,
        "from": start_date,
        "to": end_date,
    }
    url = f"https://api.covalenthq.com/v1/pricing/historical/usd/{token}/"
    data_history_response = requests.get(url=url, params=params)
    data_history_response = data_history_response.text.split('\n')
    if len(data_history_response) < 365:
        print(f'Exclude {token} token, because of unavailability of its data!')
        return None

    data_history_response = data_history_response[:-1] # remove the last item (it's empty)
    headers = data_history_response[0]
    data_history_response = data_history_response[1:] # remove the header
    if put_date_info:
        date_info = [[x.split(',')[0].strip('"'), x.split(',')[1].strip('"'), None] for x in data_history_response] # remove redundant double quote
    else:
        date_info = [[x.split(',')[1].strip('"'), None] for x in data_history_response] # remove redundant double quote

    return date_info


def get_historical_data(token, api_key, end_date, window):
    end_date_dt = datetime.strptime(end_date, "%Y-%m-%d").date()
    start_date_dt = end_date_dt - timedelta(days=window)
    start_date = start_date_dt.strftime("%Y-%m-%d")
    print(f"start date: {start_date}, end date: {end_date}")
    data_history_response = get_token_data(token, api_key, end_date, start_date)
    new_headers = ["Date", "Price", "Token", "Symbol"]
    df = pd.DataFrame(data_history_response, columns=new_headers)
    print(f"The length of the received data is: {len(data_history_response)}")  # Print the url
    print(f"Just show the head of dataframe:\n{df.head()}")
    
    return df


def get_tokens_history(tokens, api_key, end_date, window):
    end_date_dt = datetime.strptime(end_date, "%Y-%m-%d").date()
    start_date_dt = end_date_dt - timedelta(days=window)
    start_date = start_date_dt.strftime("%Y-%m-%d")
    print(f"start date: {start_date}, end date: {end_date}, window: {window}")
    excluded_tokens = []
    headers = ["date"]
    data = []
    for idx, token in enumerate(tqdm(tokens)):
        data_history = get_token_data(token, api_key, end_date, start_date, True if idx == 0 else False)
        if data_history is None:
            excluded_tokens.append(token)
            continue

        if idx == 0:
            data = data_history
        else:
            data = [a + b for a, b in zip(data, data_history)]

        headers += [token, token + "_chance"]

    df = pd.DataFrame(data, columns=headers)
    tokens = [token for token in tokens if token not in excluded_tokens]

    for i in range(df.index.size):
        if not i:
            continue

        for token in tokens:
            df[token + "_chance"].iloc[i] = str(float(df[token].iloc[i]) / float(df[token].iloc[i-1]))
            # df.iloc[i, df.columns.get_loc(token + "_chance")] = str(float(df.iloc[i, df.columns.get_loc(token)]) / float(df.iloc[i-1, df.columns.get_loc(token)]))

    df.drop(0, inplace=True)

    return df


def main(args):
    tokens = args.tokens
    chain = args.chain
    api_key = args.api_key
    window = args.window
    end_date = args.end_date
    result_dir = Path(args.result_dir)
    result_dir.mkdir(exist_ok=True)

    NOW = datetime.now()
    today_date = NOW.date()
    today_time_str = NOW.strftime("%H-%M-%S")
    print('time:', today_time_str)
    # get_historical_data("eth", api_key, end_date=end_date)
    data_df = get_tokens_history(tokens, api_key, end_date, window)
    file_name = result_dir / "result.csv"
    if file_name.is_file():
        file_name.unlink()

    data_df.to_csv(file_name, sep='\t', encoding='utf-8')


"""
    nakedFileName = '-'.join(str(e) for e in tokens)
    # Setup - Pick timeframe (1, 7, 30, 365)
    timeFrame = 30
    outputFileName = nakedFileName + str('-') + str(today_date)
    outputFileNameJson = outputFileName + '.json'
    outputFileNamePng = nakedFileName + '.png'
    # Global Variables and initalize
    cg = CoinGeckoAPI()
    allPriceHistory = []
    allCleanedHistory = []
    holder = pd.DataFrame()
    metadata = []

    for i, t in enumerate(tokens):
        # print(i,t)
        allPriceHistory = cg.get_coin_ohlc_by_id(
            id=t, vs_currency='usd', days=timeFrame)
        #[1594382400000 (time),1.1 (open),2.2 (high),3.3 (low),4.4 (close)]
        df = pd.DataFrame(allPriceHistory, columns=[
            'UnixEpochMs', 'Open', 'High', 'Low', 'Close'])

        # Set df index as date for agg lambda functions
        df['Date'] = pd.to_datetime(df['UnixEpochMs'], unit='ms')
        df.index = df['Date']
        ohlc_dict = {'Open': 'first', 'High': 'max',
                     'Low': 'min', 'Close': 'last'}
        # TODO resample rate based on settings, find better data provider TheGraph?
        tokenDailyOHLC = df.resample(
            '1D', closed='left', label='left').apply(ohlc_dict)
        # print(tokenDailyOHLC)

        # Calc 24hr % change
        # remove hyphen for chancecalc excel can't handle it in column name
        tokenDailyOHLC[t.replace('-', '')] = tokenDailyOHLC['Close'] / \
            tokenDailyOHLC['Close'].shift(1)  # TODO VERIFY not in log land
        tokenDailyOHLC.dropna(inplace=True)  # drop first row as its NaN
        # print(tokenDailyOHLC)

        # Remove unneeded columns
        dfReady = tokenDailyOHLC.drop(['Open', 'High', 'Low', 'Close'], axis=1)
        # print(dfReady)

        # Store in a dataframe each token's percentage change
        holder[t.replace('-', '')] = dfReady

    # Visualize
    # scatter plot all tokens
    pd.plotting.scatter_matrix(holder, alpha=1)
    #plt.savefig('histos/' + outputFileNamePng)

    # Build histo images for each token
    for i, t in enumerate(tokens):
        # plt.cla()
        # plt.clf()
        holder[t.replace('-', '')].plot.hist(bins=10,
                                             alpha=1, color='yellow', label=t)
        plt.savefig(t.replace('-', '')+'.png', transparent=True)

    # Generte sipmath library json
    # use 3 4 or 5 TODO need linear optimization(?) to auto fit
    # Json(holder, outputFileNameJson, "KMM", [], 'dependent', 'u', "", 4)
    # use below line to convert the dataframe to json
    holder.to_json(outputFileNameJson, orient='records')
    # SIPdata, file_name, author, SIPmetadata = [], dependence = 'independent', boundedness = 'u', bounds = [0, 1], term_saved = 5, seeds = [], setupInputs = []

    # Customize Metadata - TODO update metadata before first write?
    # open, reference, and read json file, change value, write back to json file
    a_file = open(outputFileNameJson, "r")
    json_object = json.load(a_file)
    a_file.close()
    # print(json_object)
    json_object.update({'metadata': {'tags': tokens, 'pullTime': json.dumps(NOW, indent=4, sort_keys=True,
                                                                            default=str), 'lastNperiods': timeFrame, 'reference': 'https://www.coingecko.com/en/price_charts'}})
    a_file = open(outputFileNameJson, "w")
    json.dump(json_object, a_file)
    a_file.close()
"""

if __name__ == "__main__":
    parser = argparse.ArgumentParser(
        description="Fetch data from Covalent")
    parser.add_argument("--chain",
                        default="mainnet",
                        choices=["mainnet", "rinkeby"],
                        help="visualize train and test data")
    parser.add_argument("--api_key",
                        default="ckey_1cb57deb6a9948sdfasdf05ad3497ff188",
                        help="your api key on Covalent")
    parser.add_argument("--tokens",
                        default= ['eth', 'aave', 'bal', 'link', 'crv', 'dai', 'gno', 'mke', 'rai', 'grt', 'uni', 'yfi'],
                        help="list of tokens")
    parser.add_argument("--result_dir",
                        default="./result",
                        help="the result directory path")
    parser.add_argument("--end_date",
                        default="2021-10-06",
                        help="end date of history data")
    parser.add_argument("--window",
                        default=365,
                        help="the length of hisotry data to fetch")

    args = parser.parse_args()
    main(args)
