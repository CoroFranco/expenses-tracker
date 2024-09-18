<?php

$file = 'expenses.json';



if(file_exists($file)){

    $expenses = json_decode(file_get_contents($file), true);

    if(!empty($expenses)){

        $lastExpense = end($expenses);

        $id = $lastExpense['id'] + 1;

    } else {
        $id = 0;
    }
} else {
    $expenses = [];
}

function getCurrentTime (){
    return date('Y-m-d H:i:s');
}

$command = $argv[1] ?? null;
$argument = $argv[2] ?? null;


switch($command){
    case 'add':
        $amount = $argv[3];
        $newExpense= [
            'id' => $id,
            'date' => getCurrentTime(),
            'description' => $argument,
            'amount' => $amount
        ];

        $expenses [] = $newExpense;
        file_put_contents($file, json_encode($expenses, JSON_PRETTY_PRINT));
        echo $newExpense['description'] . " tiene un gasto de: " . $newExpense['amount'];
        break;

        case 'list':
            // Cabecera de la tabla
            echo str_pad('ID', 5) . str_pad('Date', 20) . str_pad('Description', 30) . str_pad('Amount', 10) . "\n";
            echo str_repeat('-', 70) . "\n"; // Línea separadora
        
            // Contenido de la tabla
            foreach($expenses as $expense){
                printf(
                    "%-5s %-20s %-30s %-10s\n",
                    $expense['id'],
                    $expense['date'],
                    $expense['description'],
                    "$ ". $expense['amount']
                );
            }
            break;

            case 'summary':
                if (empty($argument)) {
                    // Calcula el total de gastos
                    $totalExpenses = 0;
                    foreach ($expenses as $expense) {
                        $totalExpenses += (int)$expense['amount'];
                    }
                    print "Total Expenses: " . $totalExpenses; 
                } else {
                    // Filtra los gastos por el mes pasado en $argument
                    $summaryByMonth = 0;
                    $matchingExpenses = array_filter($expenses, function($expense) use ($argument) {
                        // Obtiene el mes de la fecha del gasto
                        $expenseMonth = date('m', strtotime($expense['date']));
                        echo $expenseMonth;
                        // Compara el mes con el argumento
                        return $expenseMonth == str_pad($argument, 2);
                    });
            
                    if (count($matchingExpenses) > 0) {
                        foreach ($matchingExpenses as $expense) {
                            $summaryByMonth += (int)$expense['amount'];
                        }
                        echo 'Los gastos del mes ' . $argument . ' son: ' . $summaryByMonth;
                    } else {
                        echo "No se encontraron gastos en el mes " . $argument . ".";
                    }
                }
                break;
            

        case 'delete':
            $exists = false;

            foreach ($expenses as $expense) {
                if ($expense['id'] == $argument) {
                    $exists = true;
                    break;
                }
            }
            
            if ($exists) {
                // Si el ID existe, procedemos a eliminar el gasto
                $expenses = array_filter($expenses, function ($expense) use ($argument) {                
                    return $expense['id'] != $argument;                
                });
            
                // Reindexar el array después de eliminar el elemento
                $expenses = array_values($expenses);
            
                // Guardar el array actualizado en el archivo JSON
                file_put_contents($file, json_encode($expenses, JSON_PRETTY_PRINT));
                echo 'Gasto eliminado correctamente';
            } else {
                // Si el ID no existe, mostrar un mensaje de error
                echo 'Error: No se encontró un gasto con el ID proporcionado.';
            }
        
}