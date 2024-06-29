import pandas as pd

# The pay code to wage map
payCodeToWage = {
    1: 15,
    2: 17.5,
    3: 20,
    4: 22.25,
    5: 25,
}

# Takes in a csv file and return the processed dataframe
def get_pay(csv_file):
    # Read the csv file with pandas
    dataset = pd.read_csv(csv_file, header=None, names=["first", "last", "ssn", "code", "hours"])

    # Full name of the columns
    col_full = ["Pay code", "Hours worked"]

    # If the dataframe contains NaN or the number of columns isn't 5 raise an error to check for the comma placement
    if dataset.isnull().any().any() or dataset.shape[1] != 5:
        raise Exception("The csv is wrongly formated, please check for comma placement errors")

    # If the numeral columns has a wrong datatype raise an error to check for the wrong value entry format
    for index, col in enumerate(dataset.columns[3:]):
        if dataset[col].dtype != "int64":
            raise Exception(f"{col_full[index]} has an entry with a wrong format")

    # Get required data in O(n) time for n rows, O(1) for column-wise transformation, optimized for multithreading with numpy vectors
    dataset["overtime"] = [row["hours"] - 40 if row["hours"] > 40 else 0 for index, row in dataset.iterrows()]
    dataset["hours"] = [row["hours"] - row["overtime"] if row["hours"] > 40 else row["hours"] for index, row in dataset.iterrows()]
    dataset["wage"] = [payCodeToWage[row["code"]] for index, row in dataset.iterrows()] 
    dataset["overtime_pay"] = dataset["wage"] * dataset["overtime"] * 1.5
    dataset["pay"] = dataset["hours"] * dataset["wage"]
    dataset["taxes"] = (dataset["pay"] + dataset["overtime_pay"]) * 0.1
    dataset["total_pay"] = (dataset["pay"] +  dataset["overtime_pay"]) * 0.9 - 12

    # Return the dataframe as a list of dictionaries
    return dataset.to_dict("records")